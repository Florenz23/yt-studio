"use client";

import { useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ImageEnhancer() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setEnhancedImage(null);
    }
  };

  const handleEnhance = async () => {
    if (!selectedImage) return;

    setIsEnhancing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('/api/enhance-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to enhance image');
      }

      const blob = await response.blob();
      const enhancedUrl = URL.createObjectURL(blob);
      setEnhancedImage(enhancedUrl);
    } catch (error) {
      console.error('Error enhancing image:', error);
      alert('Failed to enhance image. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Amazing <strong>Image Enhancer</strong>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Boost colors, sharpen contrast, and add glow to your thumbnail images using AI
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>
            Select an image to enhance for your YouTube thumbnail
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (MAX. 10MB)</p>
              </div>
              <input 
                id="image-upload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
          </div>

          {selectedImage && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={handleEnhance}
                disabled={!selectedImage || isEnhancing}
                loading={isEnhancing}
                className="flex-1 sm:flex-initial"
              >
                {!isEnhancing && <Sparkles className="w-4 h-4 mr-2" />}
                {isEnhancing ? 'Enhancing Image...' : 'Enhance Image'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      {previewUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Original Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={previewUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>

          {enhancedImage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Enhanced Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={enhancedImage}
                    alt="Enhanced"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = enhancedImage;
                      link.download = 'enhanced-image.png';
                      link.click();
                    }}
                    className="w-full"
                  >
                    Download Enhanced Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}