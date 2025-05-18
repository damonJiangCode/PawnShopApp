import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

interface PhotoCaptureProps {
  customerNumber?: string;
  onCapture: (fileName: string, base64: string) => void;
  id?: string;
  idType?: string;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  customerNumber,
  onCapture,
  id,
  idType,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Camera cannot be opened", err);
      });
  }, []);

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    setPhotoData(imageDataUrl);
    console.log("imageDataUrl (PhotoCapture.tsx)", imageDataUrl);

    const base64 = imageDataUrl.replace(/^data:image\/png;base64,/, "");
    const fileName = `customer_${idType}_${id}_${Date.now()}.png`;
    console.log("fileName (PhotoCapture.tsx)", fileName);
    onCapture(fileName, base64);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        sx={{
          width: 180,
          height: 180,
          border: "1px solid #ccc",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Box mt={1}>
        <Button variant="contained" onClick={handleTakePhoto}>
          Capture
        </Button>
      </Box>

      <Box mt={4}>
        <Box
          sx={{
            width: 180,
            height: 180,
            border: "1px solid #ccc",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#f9f9f9",
          }}
        >
          {photoData ? (
            <img
              src={photoData}
              alt="Captured"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No photo yet
            </Typography>
          )}
        </Box>
      </Box>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Box>
  );
};

export default PhotoCapture;
