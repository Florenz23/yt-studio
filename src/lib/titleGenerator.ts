import { TitleVariation } from './types';
import { VIRAL_FORMULAS } from './constants';

export async function generateTitles(description: string): Promise<TitleVariation[]> {
  try {
    const response = await fetch('/api/generate-titles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { titles } = await response.json();
    
    return titles.map((title: string, index: number) => ({
      id: `title-${index + 1}`,
      title,
      characterCount: title.length,
      formula: VIRAL_FORMULAS[index % VIRAL_FORMULAS.length].name,
      trigger: VIRAL_FORMULAS[index % VIRAL_FORMULAS.length].trigger
    }));
  } catch (error) {
    console.error('Error generating titles:', error);
    throw error;
  }
}