import { useState, useMemo, useRef } from 'react';
import {
  Eraser,
  FileText,
  Sparkles,
  Loader2,
  AlertTriangle,
  Info,
  Tag,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  FileCheck,
} from 'lucide-react';
import type { Category } from '@/types';
import { SAMPLE_CONVERSATION } from '@/sampleData';

const MAX_INPUT = 200000;

interface DashboardProps {
  onAnalyze: (conversation: string, context: string, category: Category, useDemo: boolean) => void;
  isAnalyzing: boolean;
  analyzeError: string | null;
  needsDemo: boolean;
  onRetry: () => void;
  hasRetryableError: boolean;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'college', label: 'College Group' },
  { value: 'work', label: 'Work' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'event', label: 'Event' },
  { value: 'general', label: 'General' },
];

export function Dashboard({ onAnalyze, isAnalyzing, analyzeError, needsDemo, onRetry, hasRetryableError }: DashboardProps) {
  const [conversation, setConversation] = useState('');
  const [context, setContext] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = conversation.length;
  const isOverLimit = charCount > MAX_INPUT;
  const isEmpty = conversation.trim().length === 0;

  const handleClear = () => {
    setConversation('');
    setContext('');
    setLocalError(null);
    setFileName(null);
  };

  const handleSample = () => {
    setConversation(SAMPLE_CONVERSATION);
    setContext('A college class group chat with the professor and students');
    setCategory('college');
    setLocalError(null);
    setFileName(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_INPUT * 2) {
      setLocalError(`File is too large. Please limit to ${(MAX_INPUT * 2 / 1000).toFixed(0)}KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setConversation(text);
        setFileName(file.name);
        setLocalError(null);
      }
    };
    reader.onerror = () => {
      setLocalError('Could not read the file. Please try again or paste the text manually.');
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    if (isEmpty) {
      setLocalError('Please paste a conversation to analyze. The text area is currently empty.');
      return;
    }
    if (isOverLimit) {
      setLocalError(
        `This conversation is ${charCount.toLocaleString()} characters long. Please limit it to ${MAX_INPUT.toLocaleString()} characters.`
      );
      return;
    }
    setLocalError(null);
    onAnalyze(conversation, context, category, false);
  };

  const handleDemo = () => {
    setLocalError(null);
    onAnalyze(SAMPLE_CONVERSATION, context, category, true);
  };

  const charCountColor = useMemo(() => {
    if (isOverLimit) return 'text-red-400';
    if (charCount > MAX_INPUT * 0.8) return 'text-amber-400';
    return 'text-navy-300';
  }, [charCount, isOverLimit]);

  const previewLines = useMemo(() => {
    if (!conversation) return [];
    return conversation.split('\n').slice(0, 30);
  }, [conversation]);

  return (
    <div className="bg-navy-900 min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Summarize Your Conversation
          </h1>
          <p className="text-navy-300 text-lg">
            Paste any WhatsApp chat, meeting notes, or conversation and let AI extract what matters.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-navy-800 rounded-2xl border border-white/5 shadow-2xl shadow-black/20 overflow-hidden">
          {/* Text Area */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-white">
                Your Conversation
              </label>
              {fileName && (
                <span className="flex items-center gap-1.5 text-xs text-lavender-300 bg-lavender-500/10 px-2 py-1 rounded-lg">
                  <FileCheck className="w-3.5 h-3.5" />
                  {fileName}
                </span>
              )}
            </div>
            <div className="relative">
              <textarea
                value={conversation}
                onChange={(e) => {
                  setConversation(e.target.value);
                  setFileName(null);
                }}
                placeholder="Paste your WhatsApp chat, group conversation, class announcements, meeting notes, or any long conversation here..."
                className="w-full h-72 sm:h-80 p-4 rounded-xl bg-navy-900 border border-white/10 text-white placeholder-navy-400 resize-y scrollbar-thin focus:outline-none focus:border-lavender-500/50 focus:ring-2 focus:ring-lavender-500/20 transition-all text-sm leading-relaxed"
                maxLength={MAX_INPUT + 1000}
              />
            </div>

            {/* Character Counter & Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
              <span className={`text-xs font-medium ${charCountColor}`}>
                {charCount.toLocaleString()} / {MAX_INPUT.toLocaleString()} characters
                {isOverLimit && (
                  <span className="ml-2 text-red-400">- Exceeds limit</span>
                )}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-navy-200 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload TXT
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {conversation && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={isAnalyzing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-navy-200 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-40"
                  >
                    {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showPreview ? 'Hide Preview' : 'Preview'}
                  </button>
                )}
                <button
                  onClick={handleClear}
                  disabled={isEmpty || isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-navy-200 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  Clear Text
                </button>
                <button
                  onClick={handleSample}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-lavender-200 bg-lavender-500/10 hover:bg-lavender-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Sample
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            {showPreview && conversation && (
              <div className="mt-3 p-4 rounded-xl bg-navy-900 border border-white/10 max-h-60 overflow-y-auto scrollbar-thin animate-fade-in">
                <p className="text-xs text-navy-400 mb-2 font-medium">
                  Preview (first 30 lines of {conversation.split('\n').length} total):
                </p>
                <pre className="text-xs text-navy-200 whitespace-pre-wrap font-mono leading-relaxed">
                  {previewLines.join('\n')}
                  {conversation.split('\n').length > 30 && '\n...'}
                </pre>
              </div>
            )}
          </div>

          {/* Optional Fields */}
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-lavender-400" />
                  What is this about? (optional)
                </span>
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., CS class group chat, project planning..."
                className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-white/10 text-white placeholder-navy-400 text-sm focus:outline-none focus:border-lavender-500/50 focus:ring-2 focus:ring-lavender-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-lavender-400" />
                  Category
                </span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:border-lavender-500/50 focus:ring-2 focus:ring-lavender-500/20 transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Area */}
          <div className="px-6 pb-6">
            {/* Error Messages */}
            {(localError || analyzeError) && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-300 text-sm">{localError || analyzeError}</p>
                  {hasRetryableError && !localError && (
                    <button
                      onClick={onRetry}
                      disabled={isAnalyzing}
                      className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-200 bg-red-500/20 hover:bg-red-500/30 transition-all disabled:opacity-40"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retry Analysis
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Demo Mode Prompt */}
            {needsDemo && !localError && !analyzeError && (
              <div className="mb-4 p-4 rounded-xl bg-lavender-500/10 border border-lavender-500/20 flex items-start gap-3 animate-fade-in">
                <Sparkles className="w-5 h-5 text-lavender-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lavender-200 text-sm font-medium mb-1">Demo Mode Available</p>
                  <p className="text-lavender-300/80 text-sm">
                    No AI provider is currently configured. Add the GEMINI_API_KEY secret to enable real AI analysis. You can still try the full experience using demo mode with pre-generated sample results.
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || isEmpty || isOverLimit}
                className="flex-1 px-6 py-4 rounded-xl text-base font-semibold bg-lavender-500 text-white hover:bg-lavender-600 transition-all shadow-lg shadow-lavender-500/20 hover:shadow-lavender-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Conversation
                  </>
                )}
              </button>

              <button
                onClick={handleDemo}
                disabled={isAnalyzing}
                className="px-6 py-4 rounded-xl text-base font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Try Demo Mode
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 flex items-start gap-3 text-navy-400 text-sm">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Your conversation is not saved or logged. Text is only processed when you click Analyze
            and is sent to the configured AI provider (Google Gemini) for analysis. Use Clear Text
            to remove everything from the screen.
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-navy-800 rounded-2xl p-8 max-w-sm w-full mx-4 border border-lavender-500/20 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Analyzing your conversation</h3>
              <p className="text-navy-300 text-sm">
                Reading through every message to extract summaries, deadlines, decisions, and action items...
              </p>
              <div className="mt-6 w-full space-y-2">
                <div className="h-2 rounded-full bg-navy-700 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-lavender-400 to-lavender-600 rounded-full animate-shimmer" style={{ width: '60%', backgroundSize: '200% 100%' }} />
                </div>
                <p className="text-navy-400 text-xs">Long conversations may take a few more seconds...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
