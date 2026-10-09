export type Category = 'college' | 'work' | 'meeting' | 'event' | 'general';

export interface AnalysisRequest {
  conversation: string;
  context: string;
  category: Category;
}

export interface SummaryBullet {
  text: string;
}

export interface ImportantMessage {
  speaker: string | null;
  message: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  source_excerpt: string | null;
}

export interface Deadline {
  description: string;
  date: string | null;
  time: string | null;
  is_confirmed: boolean;
  is_ambiguous: boolean;
  context: string;
  speaker: string | null;
}

export interface ActionItem {
  id: string;
  task: string;
  speaker: string | null;
  completed: boolean;
}

export interface Decision {
  decision: string;
  speaker: string | null;
  context: string;
}

export interface PriorityItem {
  text: string;
  reason: string;
}

export interface Question {
  question: string;
  speaker: string | null;
  directed_at: string | null;
  is_answered: boolean;
  answer: string | null;
  answer_speaker: string | null;
  source_excerpt: string | null;
}

export interface Cancellation {
  type: 'cancellation' | 'change' | 'updated_instruction';
  description: string;
  what_changed: string;
  original: string | null;
  speaker: string | null;
  source_excerpt: string | null;
}

export interface AnalysisResult {
  summary: string[];
  important_messages: ImportantMessage[];
  deadlines: Deadline[];
  action_items: ActionItem[];
  decisions: Decision[];
  must_not_miss: PriorityItem[];
  questions: Question[];
  cancellations: Cancellation[];
  is_demo: boolean;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  is_demo?: boolean;
}
