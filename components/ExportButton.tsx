"use client";

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToPDF, generateFileName, generatePDFTitle } from '@/lib/pdfExport';

interface ExportButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
  activeView: 'historical' | 'predictions';
  disabled?: boolean;
}

export function ExportButton({ contentRef, activeView, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async () => {
    if (!contentRef.current || disabled) return;

    try {
      setIsExporting(true);

      const fileName = generateFileName(activeView);
      const title = generatePDFTitle(activeView);

      await exportToPDF(contentRef.current, fileName, title);

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={`px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-2.5 transition-all ${
        disabled
          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
          : isExporting
          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-500/30'
          : showSuccess
          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/30'
          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50'
      }`}
    >
      <AnimatePresence mode="wait">
        {isExporting ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
          >
            <Loader2 size={16} />
          </motion.div>
        ) : showSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            ✓
          </motion.div>
        ) : (
          <motion.div
            key="download"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Download size={16} />
          </motion.div>
        )}
      </AnimatePresence>

      <span>
        {isExporting ? 'Exporting...' : showSuccess ? 'Downloaded!' : 'Download PDF'}
      </span>
    </motion.button>
  );
}
