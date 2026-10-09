import { useState, useCallback, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage, HowItWorksPage } from '@/components/HomePage';
import { Dashboard } from '@/components/Dashboard';
import { ResultsPage } from '@/components/ResultsPage';
import type { Category, AnalysisResult } from '@/types';
import { DEMO_RESULT } from '@/sampleData';

type View = 'home' | 'how-it-works' | 'dashboard' | 'results';

interface AnalyzeParams {
  conversation: string;
  context: string;
  category: Category;
}

function App() {
  const [view, setView] = useState<View>('home');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [needsDemo, setNeedsDemo] = useState(false);
  const [hasRetryableError, setHasRetryableError] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const lastParamsRef = useRef<AnalyzeParams | null>(null);

  const handleNavigate = useCallback((next: View) => {
    setView(next);
    setAnalyzeError(null);
    setHasRetryableError(false);
    if (next !== 'results') {
      setResult(null);
    }
    window.scrollTo(0, 0);
  }, []);

  const performAnalysis = useCallback(
    async (conversation: string, context: string, category: Category) => {
      setIsAnalyzing(true);
      setAnalyzeError(null);
      setNeedsDemo(false);
      setHasRetryableError(false);

      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-conversation`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ conversation, context, category }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.needs_demo) {
            setNeedsDemo(true);
            setAnalyzeError(
              'No AI provider is configured yet. Add the GEMINI_API_KEY secret to enable real AI analysis. You can use Demo Mode to see how the app works.'
            );
          } else {
            setAnalyzeError(data.error || 'Analysis failed. Please try again.');
            setHasRetryableError(true);
          }
          setIsAnalyzing(false);
          return;
        }

        if (!data.success || !data.data) {
          setAnalyzeError(data.error || 'The AI could not process this conversation. Please try again.');
          setHasRetryableError(true);
          setIsAnalyzing(false);
          return;
        }

        const analysisResult = data.data as AnalysisResult;
        analysisResult.is_demo = false;
        setResult(analysisResult);
        setView('results');
        setIsAnalyzing(false);
        window.scrollTo(0, 0);
      } catch {
        setAnalyzeError(
          'Could not connect to the analysis service. Please check your connection and try again.'
        );
        setHasRetryableError(true);
        setIsAnalyzing(false);
      }
    },
    []
  );

  const handleAnalyze = useCallback(
    async (conversation: string, context: string, category: Category, useDemo: boolean) => {
      if (useDemo) {
        setIsAnalyzing(true);
        setAnalyzeError(null);
        setNeedsDemo(false);
        setHasRetryableError(false);
        setTimeout(() => {
          setResult({ ...DEMO_RESULT, is_demo: true });
          setView('results');
          setIsAnalyzing(false);
          window.scrollTo(0, 0);
        }, 1200);
        return;
      }

      lastParamsRef.current = { conversation, context, category };
      await performAnalysis(conversation, context, category);
    },
    [performAnalysis]
  );

  const handleRetry = useCallback(() => {
    if (lastParamsRef.current) {
      performAnalysis(
        lastParamsRef.current.conversation,
        lastParamsRef.current.context,
        lastParamsRef.current.category
      );
    }
  }, [performAnalysis]);

  const handleAnalyzeAnother = useCallback(() => {
    setResult(null);
    setAnalyzeError(null);
    setNeedsDemo(false);
    setHasRetryableError(false);
    lastParamsRef.current = null;
    setView('dashboard');
    window.scrollTo(0, 0);
  }, []);

  const handleClearAll = useCallback(() => {
    setResult(null);
    setAnalyzeError(null);
    setNeedsDemo(false);
    setHasRetryableError(false);
    lastParamsRef.current = null;
    setView('dashboard');
    window.scrollTo(0, 0);
  }, []);

  const showFooter = view === 'home' || view === 'how-it-works';

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      <Navbar onNavigate={handleNavigate} currentView={view} />

      <main className="flex-1">
        {view === 'home' && <HomePage onNavigate={handleNavigate} />}
        {view === 'how-it-works' && <HowItWorksPage onNavigate={handleNavigate} />}
        {view === 'dashboard' && (
          <Dashboard
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            analyzeError={analyzeError}
            needsDemo={needsDemo}
            onRetry={handleRetry}
            hasRetryableError={hasRetryableError}
          />
        )}
        {view === 'results' && result && (
          <ResultsPage
            result={result}
            onAnalyzeAnother={handleAnalyzeAnother}
            onClearAll={handleClearAll}
          />
        )}
      </main>

      {showFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;
