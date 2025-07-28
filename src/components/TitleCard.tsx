"use client";

import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { TitleVariation } from '@/lib/types';
import { clsx } from 'clsx';

interface TitleCardProps {
  title: TitleVariation;
}

export function TitleCard({ title }: TitleCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(title.title);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium leading-relaxed mb-2 break-words">
            {title.title}
          </p>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-1">
              <span className={clsx(
                "w-2 h-2 rounded-full",
                title.characterCount >= 55 && title.characterCount <= 70 ? "bg-green-400" : "bg-yellow-400"
              )}></span>
              {title.characterCount}/70
            </span>
            <span className="text-white/50">•</span>
            <span className="capitalize">{title.formula}</span>
          </div>
        </div>
        
        <button
          onClick={handleCopy}
          className={clsx(
            "flex-shrink-0 p-2 rounded-md transition-all duration-200",
            "hover:bg-white/20 active:scale-95",
            copied ? "text-green-400" : "text-white/70 hover:text-white"
          )}
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}