import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have a button component

// Helper function to convert the camera's base64 image to a File object
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const PhotoUpload = ({ onFileUpload }) => {
  const [mode, setMode] = useState('select'); // 'select', 'camera', 'preview'
  const [imgSrc, setImgSrc] = useState(null);
  const webcamRef = useRef(null);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      setMode('preview');
    }
  }, [webcamRef]);

  const handleSearch = () => {
    if (imgSrc) {
      const file = dataURLtoFile(imgSrc, 'selfie.jpg');
      onFileUpload(file);
    }
  };

  const reset = () => {
    setImgSrc(null);
    setMode('select');
  };

  // This is the container that will hold the camera and its controls
  const CameraView = () => (
     <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="flex flex-col items-center gap-4 w-full max-w-md mx-auto"
     >
        {/* This div constrains the webcam's size */}
        <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-slate-700">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user', aspectRatio: 16/9 }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-4">
           <Button variant="outline" onClick={reset}>Cancel</Button>
           <Button onClick={capture}>Capture Photo</Button>
        </div>
      </motion.div>
  );

  // This is the view for previewing the captured selfie
  const PreviewView = () => (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="flex flex-col items-center gap-4 w-full max-w-md mx-auto"
      >
        <img src={imgSrc} alt="Selfie Preview" className="w-full aspect-video rounded-lg object-cover border-2 border-slate-700" />
        <div className="flex gap-4">
            <Button variant="outline" onClick={() => setMode('camera')} className="flex items-center gap-2">
                <RefreshCw size={16} />
                Retake
            </Button>
            <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-500">Find My Photos</Button>
        </div>
      </motion.div>
  );

  // This is the initial view with the two main buttons
  const SelectView = () => (
     <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="font-semibold text-foreground mb-4">Find Your Photos</p>
        <p className="text-sm text-muted-foreground mb-8">
            Upload your photo or take a selfie to discover your moments from CUBYCSPO 25-26
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setMode('camera')} className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <Camera size={20} />
                Take Selfie
            </Button>
            <Button variant="secondary" onClick={open} className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <Upload size={20} />
                Upload Photo
            </Button>
        </div>
      </motion.div>
  );


  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      {/* This invisible div handles the file drop logic */}
      <div {...getRootProps()} className="hidden"><input {...getInputProps()} /></div>

      {/* Conditional rendering based on the current mode */}
      {mode === 'select' && <SelectView />}
      {mode === 'camera' && <CameraView />}
      {mode === 'preview' && <PreviewView />}
    </div>
  );
};

