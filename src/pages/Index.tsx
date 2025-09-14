// src/pages/Index.tsx
import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// We'll assume your hero and gallery components exist at these paths
import SpotlightHero from '@/components/SpotlightHero';
import Gallery from '@/pages/Gallery'; // We will create this next

// This is the URL for your backend API, read from the .env file
const API_URL = import.meta.env.VITE_API_URL;

export default function IndexPage() {
  // State to manage the UI: 'idle', 'loading', 'results'
  const [appState, setAppState] = useState('idle');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  // This function sends the photo to your FastAPI backend
  const handleFileUpload = async (file) => {
    if (!file) return;

    setAppState('loading');
    setError('');

    const formData = new FormData();
    formData.append('selfie', file);

    try {
      // Simulate a short delay for a better user experience
      await new Promise(res => setTimeout(res, 1500));

      const response = await axios.post(`${API_URL}/api/search`, formData);
      
      setMatches(response.data.matches);
      if (response.data.matches.length === 0) {
        setError(response.data.note || 'No matches were found for your photo.');
      }
      setAppState('results');

    } catch (err) {
      console.error(err);
      setError('An error occurred. Could not connect to the backend server.');
      setAppState('idle'); // Go back to the start on error
    }
  };

  const returnToHome = () => {
    setAppState('idle');
    setMatches([]);
    setError('');
  };

  return (
    <main>
      <AnimatePresence mode="wait">
        {appState === 'idle' && (
          <motion.div key="idle" exit={{ opacity: 0 }}>
            <SpotlightHero onFileUpload={handleFileUpload} error={error} />
          </motion.div>
        )}

        {appState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full flex flex-col justify-center items-center gap-4"
          >
            <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold text-slate-300">Processing Your Photos...</h2>
            <p className="text-slate-500">Please wait while we find your festival moments.</p>
          </motion.div>
        )}

        {appState === 'results' && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Gallery matches={matches} onReturnHome={returnToHome} error={error} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}