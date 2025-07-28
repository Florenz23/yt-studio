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

export function TitleGenerator() {
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [titles, setTitles] = useState<TitleVariation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    
    setIsGenerating(true);
    try {
      const newTitles = await generateTitles(description);
      setTitles(newTitles);
    } catch (error) {
      console.error('Error generating titles:', error);
      // You could add a toast notification here
      alert('Failed to generate titles. Please check your API key and try again.');
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
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          YouTube Title Generator
        </h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Generate 5 high-converting YouTube title variations (55-70 characters) using proven viral formulas and psychological triggers
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <label htmlFor="description" className="block text-sm font-medium text-white/90">
          Video Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your video content..."
          className="w-full h-32 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent resize-none"
        />
        
        <div className="flex gap-3">
          <button
            onClick={user ? handleGenerate : () => setShowAuthModal(true)}
            disabled={(!user && loading) || (user && (!description.trim() || isGenerating))}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {user ? (
              <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {user && isGenerating ? 'Generating...' : 'Generate Titles'}
          </button>
          
          {titles.length > 0 && user && (
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <RotateCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {titles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Generated Titles
            </h2>
            <p className="text-sm text-white/70">
              Click the copy icon to copy any title
            </p>
          </div>
          
          <div className="grid gap-4">
            {titles.map((title) => (
              <TitleCard key={title.id} title={title} />
            ))}
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}