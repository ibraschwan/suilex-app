'use client';

import { useEffect, useState } from 'react';

interface DownloadProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileSize: string;
}

export function DownloadProgressModal({
  isOpen,
  onClose,
  fileName,
  fileSize,
}: DownloadProgressModalProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'preparing' | 'downloading' | 'complete'>('preparing');
  const [downloadSpeed, setDownloadSpeed] = useState('0 MB/s');
  const [timeRemaining, setTimeRemaining] = useState('Calculating...');

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setProgress(0);
      setStage('preparing');
      return;
    }

    // Simulate download progress
    let currentProgress = 0;

    // Stage 1: Preparing (0-10%)
    const preparingInterval = setInterval(() => {
      currentProgress += Math.random() * 3;
      if (currentProgress >= 10) {
        currentProgress = 10;
        setStage('downloading');
        clearInterval(preparingInterval);

        // Stage 2: Downloading (10-100%)
        const downloadInterval = setInterval(() => {
          currentProgress += Math.random() * 5 + 2;

          // Simulate variable download speed
          const speed = (Math.random() * 15 + 5).toFixed(1);
          setDownloadSpeed(`${speed} MB/s`);

          // Calculate time remaining
          const remaining = Math.ceil((100 - currentProgress) / 7);
          setTimeRemaining(remaining > 0 ? `${remaining}s remaining` : 'Almost done...');

          if (currentProgress >= 100) {
            currentProgress = 100;
            setProgress(100);
            setStage('complete');
            setTimeRemaining('Complete!');
            clearInterval(downloadInterval);

            // Auto-close after 2 seconds
            setTimeout(() => {
              onClose();
            }, 2000);
          } else {
            setProgress(currentProgress);
          }
        }, 200);
      } else {
        setProgress(currentProgress);
      }
    }, 150);

    return () => {
      clearInterval(preparingInterval);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={stage === 'complete' ? onClose : undefined} />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card rounded-2xl border border-white/10 shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              stage === 'complete' ? 'bg-success/20' : 'bg-primary/20'
            }`}>
              <span className={`material-symbols-outlined text-3xl ${
                stage === 'complete' ? 'text-success' : stage === 'downloading' ? 'text-primary animate-pulse' : 'text-white/60'
              }`}>
                {stage === 'complete' ? 'check_circle' : 'download'}
              </span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {stage === 'preparing' && 'Preparing Download'}
                {stage === 'downloading' && 'Downloading'}
                {stage === 'complete' && 'Download Complete'}
              </h3>
              <p className="text-text-secondary-dark/60 text-sm">{fileSize}</p>
            </div>
          </div>
          {stage === 'complete' && (
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* File Name */}
        <div className="mb-6">
          <p className="text-white/80 text-sm font-medium mb-1 truncate">{fileName}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                stage === 'complete' ? 'bg-success' : 'bg-primary progress-gradient'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Progress Stats */}
        <div className="flex items-center justify-between text-sm mb-6">
          <span className="text-white font-bold">{Math.round(progress)}%</span>
          <div className="flex items-center gap-4 text-text-secondary-dark/70">
            {stage === 'downloading' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">speed</span>
                  {downloadSpeed}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {timeRemaining}
                </span>
              </>
            )}
            {stage === 'preparing' && <span>Fetching from Walrus...</span>}
            {stage === 'complete' && (
              <span className="text-success flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check</span>
                Saved to downloads
              </span>
            )}
          </div>
        </div>

        {/* Cancel/Close Button */}
        {stage !== 'complete' ? (
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors text-sm font-semibold"
          >
            Cancel Download
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-success text-white hover:bg-success/90 transition-colors text-sm font-bold"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
              Open File Location
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
