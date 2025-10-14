import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Customer } from "../../../../shared/models/Customer";

interface PhotoCaptureProps {
  customer: Customer;
  onCapture: (fileName: string, base64: string) => void;
  active?: boolean;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = (props) => {
  const { customer, onCapture, active } = props;
  const [photoData, setPhotoData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // open/close camera based on `active` prop
  useEffect(() => {
    if (active) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Failed to access camera", err);
          alert("Failed to access camera (PhotoCapture.tsx).");
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [active]);

  // Load existing photo if customerNumber is provided
  useEffect(() => {
    if (customer.customer_number && customer.image_path) {
      (async () => {
        try {
          const base64 = await (window as any).electronAPI.getCustomerImage(
            customer.image_path
          );
          // console.log("Loaded customer image", base64);
          if (base64) {
            setPhotoData(`data:image/png;base64,${base64}`);
          }
        } catch (err) {
          console.error("Failed to load customer image", err);
          alert("Failed to load customer image (PhotoCapture.tsx).");
          throw err;
        }
      })();
    }
  }, []);

  // Take photo
  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      alert("Camera not initialized (PhotoCapture.tsx).");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    setPhotoData(imageDataUrl);

    const base64 = imageDataUrl.replace(/^data:image\/png;base64,/, "");
    const fileName = customer.customer_number
      ? `customer_${customer.customer_number}.png`
      : `customer_temp_${Date.now()}.png`;

    onCapture(fileName, base64);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {/* Camera preview */}
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
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Box mt={1}>
        <Button variant="contained" onClick={handleTakePhoto}>
          Capture
        </Button>
      </Box>

      {/* Photo result or old photo */}
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
