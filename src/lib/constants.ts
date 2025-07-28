import { ViralFormula, PowerWords } from './types';

export const POWER_WORDS: PowerWords = {
  curiosity: ["Secret", "Hidden", "Truth", "Behind-the-Scenes", "Revealed", "Exposed", "Unknown", "Mystery"],
  urgency: ["Stop", "Don't", "Before", "Never", "Now", "Urgent", "Warning", "Alert"],
  value: ["Free", "Ultimate", "Best", "Proven", "Simple", "Easy", "Complete", "Perfect"],
  transformation: ["Transform", "Change", "Improve", "Boost", "Increase", "Double", "Triple", "Maximize"]
};

export const VIRAL_FORMULAS: ViralFormula[] = [
  {
    name: "Curiosity Gap",
    pattern: "[Intriguing Statement] + [Open Loop]",
    description: "Creates intrigue with an incomplete thought",
    trigger: "curiosity"
  },
  {
    name: "Transformation",
    pattern: "[Before State] → [After State]",
    description: "Shows clear before and after transformation",
    trigger: "transformation"
  },
  {
    name: "Authority Insider",
    pattern: "[Expert/Secret] + [Exclusive Info]",
    description: "Leverages authority and exclusivity",
    trigger: "authority"
  },
  {
    name: "Time-Bound",
    pattern: "[Action] in [Timeframe] + [Result]",
    description: "Creates urgency with specific timeframes",
    trigger: "urgency"
  },
  {
    name: "Question Hook",
    pattern: "[Compelling Question] + [Promise]",
    description: "Engages with questions and promises answers",
    trigger: "curiosity"
  }
];

export const DEFAULT_DESCRIPTION = "I tested a 5 AM morning routine for 30 days. The results completely changed my productivity and energy levels. Here's exactly what I did and how you can customize it for your schedule.";