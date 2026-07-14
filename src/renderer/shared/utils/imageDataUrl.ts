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

export const getImageDataUrl = (base64: string, imagePath?: string) =>
  `data:${getImageMimeType(imagePath)};base64,${base64}`;
