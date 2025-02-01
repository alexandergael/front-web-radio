"use client";

import { useState, useRef } from "react";
import { Button, Stack, InputLabel, Box } from "@mui/material";
import { Upload } from "@mui/icons-material";
import Image from "next/image";

interface FileUploadProps {
  onFileSelected: (file: File | null) => void;
}

export default function FileUpload({ onFileSelected }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      onFileSelected(selectedFile);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreviewUrl(null);
      onFileSelected(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Stack spacing={1}>
      <InputLabel>Pochette</InputLabel>{" "}
      <Box display="flex" alignItems="center" gap={2}>
        <input
          type="file"
          id="file-upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <Button
          startIcon={<Upload />}
          variant="outlined"
          className="w-full"
          onClick={handleButtonClick}
        >
          Upload
        </Button>
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Preview"
            width={40}
            height={40}
            style={{
              borderRadius: "4px",
            }}
          />
        )}
      </Box>
    </Stack>
  );
}
