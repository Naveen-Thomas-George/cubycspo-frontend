// src/pages/Gallery.tsx
import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";

// API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

const PhotoCard = ({ photo, onEnlarge }) => {
  const handleDownloadSingle = async () => {
    try {
      const response = await axios.get(photo.url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `CUBYCSPO_Photo_${photo.photo_id}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Single photo download failed", err);
      // You could show a toast notification here
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-festival hover:shadow-glow transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={photo.thumb}
          alt={`Photo ${photo.photo_id}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={() => onEnlarge(photo.url)}
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-2 truncate">CUBYCSPO_Photo_{photo.photo_id}.jpg</p>
        <Button size="sm" variant="outline" onClick={handleDownloadSingle} className="w-full flex items-center gap-2">
          <Download className="w-3 h-3" />
          Download
        </Button>
      </div>
    </motion.div>
  );
};


export default function Gallery({ matches, onReturnHome, error }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleDownloadAll = async () => {
    const urlsToDownload = matches.map(p => p.url);
    if (urlsToDownload.length === 0) return;
    try {
      const response = await axios.post(`${API_URL}/download_zip`, { urls: urlsToDownload }, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'CUBYCSPO_All_Photos.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("ZIP download failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-sm">
      <nav className="bg-card/50 backdrop-blur-sm border-b border-border px-4 py-3 sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-primary">DPE</h2>
            <Button variant="outline" size="sm" onClick={onReturnHome} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Button>
          </div>
          <Button onClick={handleDownloadAll} className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4" />
            Download All as ZIP
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Festival Photos</h1>
          <p className="text-muted-foreground">Found {matches.length} photos from CUBYCSPO 25-26</p>
          {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {matches.map((photo, index) => (
            <PhotoCard key={photo.photo_id} photo={photo} onEnlarge={setSelectedPhoto} />
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedPhoto} alt="Enlarged" className="max-w-full max-h-full object-contain rounded-lg" />
            <Button variant="outline" size="sm" className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedPhoto(null)}>
              ✕
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}