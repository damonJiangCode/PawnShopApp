import fs from "node:fs/promises";
import type { XmlReportImagePayload } from "../../../shared/payload-contracts/xmlReport.contract.ts";
import { imageStorage } from "../../shared/imageStorage.ts";
import type {
  LeadsOnlineTicket,
  XmlReportImageReferences,
  XmlReportSourceRow,
} from "./xml-report.types.ts";

const getImageType = (
  data: Buffer,
): XmlReportImagePayload["imageType"] | null => {
  if (
    data.length >= 3 &&
    data[0] === 0xff &&
    data[1] === 0xd8 &&
    data[2] === 0xff
  ) {
    return "Jpeg";
  }
  if (
    data.length >= 8 &&
    data
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "Png";
  }
  if (
    data.length >= 6 &&
    ["GIF87a", "GIF89a"].includes(data.subarray(0, 6).toString("ascii"))
  ) {
    return "Gif";
  }
  return null;
};

const loadImage = async (
  kind: "client" | "item",
  imagePath: string,
  imageCategory: XmlReportImagePayload["imageCategory"],
): Promise<XmlReportImagePayload> => {
  const resolvedPath = await imageStorage.resolveImageFile(kind, imagePath);
  if (!resolvedPath) {
    throw new Error(`The ${kind} photo could not be found: ${imagePath}`);
  }

  const imageBytes = await fs.readFile(resolvedPath);
  const imageType = getImageType(imageBytes);
  if (!imageType) {
    throw new Error(
      `The ${kind} photo uses an unsupported format. Use JPEG, PNG, or GIF: ${imagePath}`,
    );
  }

  return {
    imageCategory,
    imageType,
    imageData: imageBytes.toString("base64"),
  };
};

export const getXmlReportImageReferences = (
  rows: XmlReportSourceRow[],
): XmlReportImageReferences => ({
  client_image_path: rows[0]?.client_image_path ?? "",
  item_image_paths: rows
    .filter((row) => row.item_number !== undefined)
    .map((row) => row.item_image_path),
});

export const getXmlReportImageWarnings = (
  references: XmlReportImageReferences,
) => {
  const warnings: string[] = [];
  if (!references.client_image_path) {
    warnings.push("Customer photo is missing.");
  }

  references.item_image_paths.forEach((imagePath, index) => {
    if (!imagePath) {
      warnings.push(`Item ${index + 1} photo is missing.`);
    }
  });
  return warnings;
};

export const attachXmlReportImages = async (
  payload: LeadsOnlineTicket,
  references: XmlReportImageReferences,
): Promise<LeadsOnlineTicket> => {
  const customerImages = references.client_image_path
    ? [await loadImage("client", references.client_image_path, "Customer")]
    : [];

  const items = await Promise.all(
    payload.items.Item.map(async (item, index) => {
      const imagePath = references.item_image_paths[index];
      if (!imagePath) {
        return item;
      }

      return {
        ...item,
        images: {
          Image: [await loadImage("item", imagePath, "Item")],
        },
      };
    }),
  );

  return {
    ...payload,
    customer: {
      ...payload.customer,
      ...(customerImages.length ? { images: { Image: customerImages } } : {}),
    },
    items: { Item: items },
  };
};
