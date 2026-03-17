"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type ImageCropDialogProps = {
  open: boolean;
  onClose: () => void;
  onCropped: (url: string) => void;
  aspectRatio: number;
  outputWidth: number;
  outputHeight: number;
  uploadPath: string;
};

export function ImageCropDialog({
  open,
  onClose,
  onCropped,
  aspectRatio,
  outputWidth,
  outputHeight,
  uploadPath,
}: ImageCropDialogProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const cropSize = Math.min(width, height / aspectRatio, width);
      setCrop({
        unit: "px",
        x: (width - cropSize) / 2,
        y: (height - cropSize * aspectRatio) / 2,
        width: cropSize,
        height: cropSize / aspectRatio,
      });
    },
    [aspectRatio],
  );

  const handleCropAndUpload = async () => {
    if (!imgRef.current || !completedCrop) return;

    setUploading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext("2d")!;

      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        outputWidth,
        outputHeight,
      );

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/webp", 0.85),
      );

      const formData = new FormData();
      formData.append("file", blob, uploadPath.split("/").pop()!);
      formData.append("path", uploadPath);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const { url } = await res.json();
      onCropped(url);
      handleClose();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4">Gorsel Kirp ve Yukle</h3>

        {!imageSrc ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="max-h-96"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                onLoad={onImageLoad}
                alt="Crop preview"
                className="max-h-96"
              />
            </ReactCrop>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Iptal
          </button>
          {imageSrc && (
            <button
              onClick={handleCropAndUpload}
              disabled={!completedCrop || uploading}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {uploading ? "Yukleniyor..." : "Kirp ve Yukle"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
