import { useEffect, useState } from "react";

export const useClientImage = (imagePath?: string) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setSrc(null);

    const load = async () => {
      if (!imagePath) {
        return;
      }
      const api = (window as any).electronAPI;
      if (!api?.getClientImage) {
        return;
      }
      try {
        const base64 = await api.getClientImage(imagePath);
        if (!active) {
          return;
        }
        setSrc(base64 ? `data:image/png;base64,${base64}` : null);
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
