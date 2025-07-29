"use client";

import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { TitleVariation } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <Card className="group relative hover:bg-accent/50 transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-card-foreground font-medium leading-relaxed mb-2 break-words">
              {title.title}
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  title.characterCount >= 55 && title.characterCount <= 70 ? "bg-green-500" : "bg-yellow-500"
                )}></span>
                {title.characterCount}/70
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span className="capitalize">{title.formula}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn(
              "flex-shrink-0 transition-all duration-200 active:scale-95",
              copied ? "text-green-500" : "text-muted-foreground hover:text-foreground"
            )}
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}