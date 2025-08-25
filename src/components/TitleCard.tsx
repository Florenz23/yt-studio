"use client";

import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { TitleVariation } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const getCharacterStatus = () => {
    if (title.characterCount >= 55 && title.characterCount <= 70) {
      return { variant: "success" as const, label: "Optimal" };
    } else if (title.characterCount >= 45 && title.characterCount < 55) {
      return { variant: "warning" as const, label: "Good" };
    } else {
      return { variant: "destructive" as const, label: "Adjust" };
    }
  };

  const charStatus = getCharacterStatus();

  return (
    <Card className="group relative hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            <p className="text-foreground font-medium text-lg leading-relaxed break-words group-hover:text-primary transition-colors">
              {title.title}
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Character count badge */}
              <Badge 
                variant={charStatus.variant}
                className="text-xs font-medium"
              >
                {title.characterCount}/70 • {charStatus.label}
              </Badge>
              
              {/* Formula badge */}
              <Badge variant="outline" className="text-xs">
                {title.formula}
              </Badge>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn(
              "flex-shrink-0 transition-all duration-200 active:scale-95 rounded-full",
              copied 
                ? "text-success bg-success/10 hover:bg-success/20" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            title={copied ? "Copied!" : "Copy to clipboard"}
            aria-label={copied ? "Title copied to clipboard" : "Copy title to clipboard"}
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