"use client";

import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function UploadPanel({ onUpload }: { onUpload: () => void }) {
  const onDrop = async (files: File[]) => {
    const formData = new FormData();
    formData.append("image", files[0]);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        formData
      );

      alert("Uploaded successfully 🎉");

      // 🔥 refresh gallery
      onUpload();
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-white/20 p-8 text-center cursor-pointer rounded-xl backdrop-blur-md bg-white/10"
    >
      <input {...getInputProps()} />
      <p className="text-sm opacity-70">
        Drag & drop memories here 💫
      </p>
    </div>
  );
}