export interface TitleVariation {
  id: string;
  title: string;
  characterCount: number;
  formula: string;
  trigger: string;
}

export interface ViralFormula {
  name: string;
  pattern: string;
  description: string;
  trigger: string;
}

export interface PowerWords {
  curiosity: string[];
  urgency: string[];
  value: string[];
  transformation: string[];
}