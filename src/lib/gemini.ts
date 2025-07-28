import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateTitlesWithGemini(description: string): Promise<string[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const prompt = `
You are a YouTube title expert specializing in viral content. Generate exactly 5 high-converting YouTube titles for the following video description. Each title must be between 55-70 characters.

Video Description: "${description}"

Requirements:
- Each title must be 55-70 characters long
- Use proven viral formulas (curiosity gap, transformation, authority, time-bound, question hook)
- Include psychological triggers (curiosity, urgency, value, transformation)
- Front-load keywords in the first 5 words
- Target 4-8% CTR through compelling hooks

Viral formulas to apply:
1. Curiosity Gap: "[Intriguing Statement] + [Open Loop]"
2. Transformation: "[Before State] → [After State]"
3. Authority Insider: "[Expert/Secret] + [Exclusive Info]"
4. Time-Bound: "[Action] in [Timeframe] + [Result]"
5. Question Hook: "[Compelling Question] + [Promise]"

Power words to consider: Secret, Hidden, Truth, Stop, Don't, Never, Free, Ultimate, Best, Proven, Transform, Double, Increase

Please respond with exactly 5 titles, one per line, with no numbering or additional text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text.trim();
    const titles = text.split('\n').filter(title => title.trim().length > 0);
    
    if (titles.length !== 5) {
      throw new Error(`Expected 5 titles, got ${titles.length}`);
    }

    return titles.map(title => title.trim());
  } catch (error) {
    console.error('Error generating titles with Gemini:', error);
    throw new Error('Failed to generate titles. Please try again.');
  }
}