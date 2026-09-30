export interface JournalMetadata {
  title: string;
  date: string;
  time?: string;
  tags: string[];
  dominantEmotion: string;
  moodScore: number; // 1 to 5
  energyLevel: string; // "Rendah", "Sedang", "Tinggi"
  summary: string;
  keyInsights: string[];
  actionItems: string[];
  connectedConcepts: string[];
}

export interface JournalEntry extends JournalMetadata {
  id: string;
  createdAt: number;
  updatedAt?: number;
  sourceMode: 'voice' | 'manual';
  rawTranscript?: string;
  markdownContent: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface CompanionPrompt {
  id: string;
  title: string;
  category: string;
  starterMessage: string;
  systemContext: string;
}
