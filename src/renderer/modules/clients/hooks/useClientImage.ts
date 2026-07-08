import { useEffect, useState } from "react";
import { clientService } from "../client.api";

const getImageMimeType = (imagePath?: string) => {
  const lowerPath = imagePath?.toLowerCase() ?? "";
  if (lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (lowerPath.endsWith(".gif")) {
    return "image/gif";
  }
  if (lowerPath.endsWith(".bmp") || lowerPath.endsWith(".bin")) {
    return "image/bmp";
  }
  return "image/png";
};

export const getClientImageDataUrl = (
  base64: string,
  imagePath?: string,
) => `data:${getImageMimeType(imagePath)};base64,${base64}`;

export const useClientImage = (imagePath?: string) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setSrc(null);

    const load = async () => {
      if (!imagePath) {
        return;
      }
      try {
        const base64 = await clientService.loadClientImage(imagePath);
        if (!active) {
          return;
        }
        setSrc(base64 ? getClientImageDataUrl(base64, imagePath) : null);
      } catch {
        if (!active) {
          return;
        }
        setSrc(null);
      }
    };
    load();

    return () => {
      active = false;
    };
  }, [imagePath]);

  return src;
};
