import React, { useRef } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

interface ImageUploaderProps {
  imageData: string | null;
  setImageData: (data: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageData, setImageData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box>
      <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, display: 'block', mb: 1 }}>
        Optional Issue Photo Attachment
      </Typography>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {imageData ? (
        <Box sx={{ position: 'relative', width: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(14, 165, 233, 0.4)' }}>
          <Box
            component="img"
            src={imageData}
            alt="Uploaded preview"
            sx={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }}
          />
          <IconButton
            onClick={handleClear}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(15, 23, 42, 0.8)',
              color: '#EF4444',
              '&:hover': { bgcolor: '#EF4444', color: '#FFFFFF' }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '2px dashed rgba(255, 255, 255, 0.15)',
            bgcolor: 'rgba(15, 23, 42, 0.4)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#38BDF8',
              bgcolor: 'rgba(56, 189, 248, 0.05)'
            }
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 36, color: '#38BDF8', mb: 1 }} />
          <Typography variant="subtitle2" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
            Click to upload or drag image file here
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            Supports JPG, PNG, WEBP (Max 5MB)
          </Typography>
        </Box>
      )}
    </Box>
  );
};
