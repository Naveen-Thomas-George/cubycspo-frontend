// src/components/ui/PhotoUpload.tsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

export const PhotoUpload = ({ onFileUpload }) => {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false
  });

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <div {...getRootProps()}>
        <motion.div
          className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-foreground/50'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <div className="w-16 h-16 bg-card/80 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="font-semibold text-foreground">Find Your Photos</p>
            <p className="text-sm">Upload your photo or take a selfie to discover your moments from CUBYCSPO 25-26</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};