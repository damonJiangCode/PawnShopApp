import { useEffect, useState } from "react";

export const useClientImage = (imagePath?: string) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!imagePath) {
        setSrc(null);
        return;
      }
      const api = (window as any).electronAPI;
      if (!api?.getClientImage) {
        setSrc(null);
        return;
      }
      try {
        const base64 = await api.getClientImage(imagePath);
        setSrc(base64 ? `data:image/png;base64,${base64}` : null);
      } catch {
        setSrc(null);
      }
    };
    load();
  }, [imagePath]);

  return src;
};
