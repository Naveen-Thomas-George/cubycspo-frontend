import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, Upload, RefreshCw } from 'lucide-react';

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

  // We get the `open` function from useDropzone to trigger the file dialog manually
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
    noClick: true, // Prevent the dropzone div from opening the dialog
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

  return (
    <div className="w-full max-w-lg mx-auto mt-8 text-center">
      {mode === 'select' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button onClick={() => setMode('camera')} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
            <Camera size={20} />
            Take Selfie
          </button>
          
          {/* This button now manually triggers the file upload dialog */}
          <button onClick={open} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
            <Upload size={20} />
            Upload Photo
          </button>
        </motion.div>
      )}

      {mode === 'camera' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <div className="w-full max-w-sm rounded-lg overflow-hidden border-2 border-slate-700">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user', width: 1280, height: 720 }}
            />
          </div>
          <div className="flex gap-4">
             <button onClick={reset} className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
             <button onClick={capture} className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors">Capture Photo</button>
          </div>
        </motion.div>
      )}
      
      {mode === 'preview' && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <img src={imgSrc} alt="Selfie Preview" className="w-full max-w-sm rounded-lg border-2 border-slate-700" />
            <div className="flex gap-4">
               <button onClick={reset} className="flex items-center gap-2 px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <RefreshCw size={16} />
                  Retake
               </button>
               <button onClick={handleSearch} className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors">Find My Photos</button>
            </div>
         </motion.div>
      )}

      {/* The dropzone still exists invisibly to handle the onDrop event */}
      <div {...getRootProps()} className="hidden">
        <input {...getInputProps()} />
      </div>
    </div>
  );
};

