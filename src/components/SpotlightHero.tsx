// src/components/ui/SpotlightHero.tsx
import * as React from 'react';
import { Spotlight } from "@/components/ui/Spotlight";
import { motion } from "framer-motion";
import { PhotoUpload } from './PhotoUploadSection'; // Import the new component

// The component now accepts props to handle file uploads and display errors
export default function SpotlightHero({ onFileUpload, error }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background/95 relative overflow-hidden p-4">
      <Spotlight />
      
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <div className="flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground/90 tracking-widest uppercase">
              Department of Physical Education
            </h1>
            
            <h2 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mt-4">
              CUBYCSPO
            </h2>
            
            <p className="text-4xl md:text-6xl font-bold text-foreground/90 mt-2">
              25-26
            </p>
          </div>
          
          <motion.p 
            className="mt-8 font-normal text-lg md:text-xl text-muted-foreground max-w-2xl text-center mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            The Premier <span className="text-primary font-semibold">Inter-Collegiate</span> Festival
          </motion.p>

          {/* Integrate the uploader component here */}
          <PhotoUpload onFileUpload={onFileUpload} />

          {/* Display any error message passed down from the main page */}
          {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}
          
        </motion.div>
      </div>
    </div>
  );
}