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
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
          YouTube Title Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Generate 5 high-converting YouTube title variations (55-70 characters) using proven viral formulas and psychological triggers
        </p>
      </div>

      {/* Generation Counter */}
      {user && generationData && (
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Generations remaining: <span className="font-semibold text-foreground">{generationData.remaining}</span> / {generationData.limit}
          </p>
        </div>
      )}

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
          
          <div className="flex gap-3">
            <Button
              onClick={user ? handleGenerate : () => setShowAuthModal(true)}
              disabled={(!user && loading) || (!!user && (!description.trim() || isGenerating || (generationData?.remaining === 0)))}
              className="flex items-center gap-2"
            >
              {user ? (
                <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {user && isGenerating ? 'Generating...' : 
               user && generationData?.remaining === 0 ? 'Limit Reached' : 
               'Generate Titles'}
            </Button>
            
            {titles.length > 0 && user && (
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                <RotateCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {titles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Titles</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click the copy icon to copy any title
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {titles.map((title) => (
                <TitleCard key={title.id} title={title} />
              ))}
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