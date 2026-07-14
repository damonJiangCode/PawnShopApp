import { useEffect, useState } from "react";
import { getImageDataUrl } from "../../../shared/utils/imageDataUrl";
import { clientService } from "../client.api";

export const getClientImageDataUrl = (
  base64: string,
  imagePath?: string,
) => getImageDataUrl(base64, imagePath);

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
