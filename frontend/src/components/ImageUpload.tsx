import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImageUpload: (base64String: string | ArrayBuffer | null) => void;
  children: React.ReactNode;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  children,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // For each file, convert to Base64
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          onImageUpload(base64String);
        };
        reader.readAsDataURL(file);
      });
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default ImageUpload;
