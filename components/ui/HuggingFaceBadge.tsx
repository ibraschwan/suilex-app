import React from 'react';

interface HuggingFaceBadgeProps {
  datasetId?: string;
  downloads?: number;
  likes?: number;
  size?: 'sm' | 'md';
}

export const HuggingFaceBadge: React.FC<HuggingFaceBadgeProps> = ({
  datasetId,
  downloads,
  likes,
  size = 'sm',
}) => {
  const url = datasetId ? `https://huggingface.co/datasets/${datasetId}` : 'https://huggingface.co';

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 ${sizeClasses} hover:border-yellow-500/50 transition-colors group`}
        title="View on Hugging Face"
      >
        <span className="font-bold text-yellow-500">🤗</span>
        <span className="font-semibold text-yellow-400">Hugging Face</span>
        <span className="material-symbols-outlined text-[14px] text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
          open_in_new
        </span>
      </a>

      {(downloads !== undefined || likes !== undefined) && (
        <div className="flex items-center gap-2 text-xs text-text-secondary-dark/60">
          {downloads !== undefined && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">download</span>
              {downloads >= 1000 ? `${(downloads / 1000).toFixed(1)}K` : downloads}
            </span>
          )}
          {likes !== undefined && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">favorite</span>
              {likes}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
