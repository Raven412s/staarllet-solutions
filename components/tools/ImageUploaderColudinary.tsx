"use client";

import React, { useState } from "react";
import { ImageInput } from "../ui/image-input";


const ImageUploaderCloudinary = () => {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <ImageInput
        value={imageUrl}
        onChange={(url) => {
          setImageUrl(url); // 👈 jaise hi file upload hoga, Cloudinary URL aa jayega
        }}
      />

      {imageUrl && (
        <p className="text-sm text-gray-600">
          ✅ Uploaded Image:{" "}
          <a href={imageUrl} target="_blank" className="text-violet-600 underline">
            {imageUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default ImageUploaderCloudinary;
