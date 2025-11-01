import React, { useState, useRef, useEffect, useCallback } from "react";
import Tesseract from "tesseract.js";
import { Button } from "@/components/ui/button";

const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;

const OCRUpload: React.FC = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      streamRef.current = stream;
      setCameraActive(true);

      const track = stream.getVideoTracks()[0];
      track.onended = () => stopCamera();
    } catch (err) {
      console.error(err);
      setCameraError("Unable to access camera. Please allow permissions.");
      alert("Camera permission is required. Please enable and retry.");
    }
  }, [stopCamera]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const noStream =
          !streamRef.current ||
          streamRef.current.getTracks().every((t) => t.readyState === "ended");
        if (cameraActive && noStream) startCamera();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [cameraActive, startCamera]);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    let checkInterval: number | null = null;

    const checkVideoFeed = () => {
      if (cameraActive && streamRef.current) {
        const tracks = streamRef.current.getVideoTracks();
        const isEnded =
          tracks.length === 0 || tracks.every((t) => t.readyState === "ended");
        if (isEnded || video.readyState < 2) {
          stopCamera();
          setTimeout(() => startCamera(), 1000);
        }
      }
    };

    checkInterval = window.setInterval(checkVideoFeed, 2000);
    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [cameraActive, startCamera, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const imageData = canvasRef.current.toDataURL("image/png");
    await processImage(imageData);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      await processImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageData: string) => {
    setLoading(true);
    setSummary("");
    try {
      const ocrResult = await Tesseract.recognize(imageData, "eng");
      const extractedText = ocrResult.data.text.trim();
      if (!extractedText) {
        alert("No readable text found in the image.");
        return;
      }

      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: extractedText }),
      });

      const data = await response.json();
      const summaryText = Array.isArray(data)
        ? data[0]?.summary_text || "Could not generate summary."
        : "Could not generate summary.";
      setSummary(summaryText);
    } catch (error) {
      console.error("Error during OCR/Summary:", error);
      alert("Failed to process document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-white shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Scan or Upload Document
      </h2>

      <div className="w-full mb-6 text-center">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition block"
        >
          <p className="text-gray-600 mb-2">
            {fileName ? `Uploaded: ${fileName}` : "Click to upload your medical report"}
          </p>
          <p className="text-sm text-gray-400">Supported: PDF, JPG, PNG, DOCX</p>
        </label>
      </div>

      {!cameraActive ? (
        <div className="flex flex-col items-center">
          <Button onClick={startCamera} className="bg-teal-600 text-white mb-4">
            {cameraError ? "Retry Camera" : "Open Camera to Scan"}
          </Button>
          {cameraError && (
            <p className="text-red-500 text-sm text-center max-w-xs">{cameraError}</p>
          )}
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-lg border mb-4 w-full max-h-80 object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-4">
            <Button
              onClick={captureImage}
              disabled={loading}
              className="bg-teal-600 text-white"
            >
              {loading ? "Processing..." : "Capture"}
            </Button>
            <Button onClick={stopCamera} variant="outline">
              Cancel
            </Button>
          </div>
        </>
      )}

      {loading && (
        <p className="mt-4 text-gray-500 text-sm italic">
          Processing document, please wait...
        </p>
      )}
      {summary && (
        <div className="mt-6 w-full bg-gray-50 p-4 rounded-lg border text-gray-800">
          <h3 className="font-semibold text-lg mb-2">AI Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default OCRUpload;
