import {
  IMAGE_PROTOCOL,
  type ImageKind,
} from "../../../shared/payload-contracts/image.contract.ts";

export const getImageUrl = (
  kind: ImageKind,
  imagePath?: string,
): string | null => {
  if (!imagePath) {
    return null;
  }

  const url = new URL(`${IMAGE_PROTOCOL}://${kind}/image`);
  url.searchParams.set("path", imagePath);
  return url.toString();
};
