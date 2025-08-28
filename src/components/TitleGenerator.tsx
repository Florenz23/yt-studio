"use client";

import { useState, useEffect } from 'react';
import { Wand2, RotateCcw, Lock } from 'lucide-react';
import { generateTitles } from '@/lib/titleGenerator';
import { DEFAULT_DESCRIPTION } from '@/lib/constants';
import { TitleVariation } from '@/lib/types';
import { TitleCard } from './TitleCard';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { AuthModal } from './AuthModal';
import { trpc } from './TRPCProvider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function TitleGenerator() {
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [titles, setTitles] = useState<TitleVariation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // tRPC hooks
  const trackEventMutation = trpc.events.trackEvent.useMutation();
  const { data: generationData, refetch: refetchGenerationData } = trpc.events.getUserGenerationCount.useQuery(
    { userId: user?.id || '' },
    { enabled: !!user?.id }
  );

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!description.trim() || !user) return;
    
    // Check if user has reached generation limit
    if (generationData && generationData.remaining <= 0) {
      alert(`You've reached your limit of ${generationData.limit} generations. Please try again later.`);
      return;
    }
    
    setIsGenerating(true);
    try {
      // Track the generation event (don't fail if tracking fails)
      try {
        await trackEventMutation.mutateAsync({
          userId: user.id,
          eventType: 'title_generation',
          eventCategory: 'product',
          eventAction: 'generate',
          eventLabel: 'button_click',
          eventValue: 1,
        });
      } catch (trackingError) {
        console.warn('Failed to track event, but continuing with generation:', trackingError);
      }

      const newTitles = await generateTitles(description);
      setTitles(newTitles);
      
      // Refetch generation data to update the UI (don't fail if this fails)
      try {
        refetchGenerationData();
      } catch (refetchError) {
        console.warn('Failed to refetch generation data:', refetchError);
      }
    } catch (error) {
      console.error('Error generating titles:', error);
      alert('Failed to generate titles. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };


  const handleRegenerate = () => {
    if (titles.length > 0) {
      handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            <strong>YouTube Title Generator</strong>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate 5 high-converting YouTube title variations (55-70 characters) using proven viral formulas and psychological triggers
          </p>
        </div>

        {/* Generation Counter */}
        {user && generationData && (
          <div className="flex justify-center">
            <Badge 
              variant={generationData.remaining > 5 ? "success" : generationData.remaining > 2 ? "warning" : "destructive"}
              className="text-sm px-4 py-2"
            >
              {generationData.remaining} / {generationData.limit} generations remaining
            </Badge>
          </div>
        )}
        
        {loading && !user && (
          <div className="flex justify-center">
            <Skeleton className="h-6 w-48" />
          </div>
        )}
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Video Description</CardTitle>
          <CardDescription>
            Describe your video content to generate compelling titles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your video content..."
            className="min-h-[120px] resize-none"
          />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={user ? handleGenerate : () => setShowAuthModal(true)}
              disabled={(!user && loading) || (!!user && (!description.trim() || isGenerating || (generationData?.remaining === 0)))}
              loading={isGenerating}
              className="flex-1 sm:flex-initial"
            >
              {!isGenerating && (
                user ? (
                  <Wand2 className="w-4 h-4 mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )
              )}
              {user && isGenerating ? 'Generating Amazing Titles...' : 
               user && generationData?.remaining === 0 ? 'Generation Limit Reached' : 
               user ? 'Generate Viral Titles' : 'Sign In to Generate Titles'}
            </Button>
            
            {titles.length > 0 && user && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleRegenerate}
                disabled={isGenerating}
                loading={isGenerating}
              >
                {!isGenerating && <RotateCcw className="w-4 h-4 mr-2" />}
                Regenerate
              </Button>
            )}
          </div>
          
          {!user && !loading && (
            <div className="p-4 rounded-lg border border-border bg-muted/30 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground mb-1">Authentication Required</p>
              <p className="text-sm text-muted-foreground">
                Sign in to start generating viral YouTube titles
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 animate-spin text-primary" />
              Generating Your Titles...
            </CardTitle>
            <CardDescription>
              Creating viral YouTube titles using advanced AI algorithms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {titles.length > 0 && !isGenerating && (
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Generated Titles
                  <Badge variant="secondary" className="ml-2">
                    {titles.length}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  High-converting title variations optimized for YouTube
                </CardDescription>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the copy icon to copy any title
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {titles.map((title, index) => (
                <div key={title.id} className="relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <TitleCard title={title} />
                </div>
              ))}
            </div>
            
            {/* Pro tip section */}
            <div className="mt-6 p-4 rounded-lg bg-info/10 border border-info/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-info/20 flex items-center justify-center">
                  <span className="text-sm">💡</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Pro Tips for Maximum Impact</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Titles with 55-70 characters perform best on YouTube</li>
                    <li>• Test different titles to see which resonates with your audience</li>
                    <li>• Use urgency and curiosity to drive clicks</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}