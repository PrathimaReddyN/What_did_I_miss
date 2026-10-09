import {
  Sparkles,
  CalendarClock,
  AlertCircle,
  ClipboardPaste,
  Cpu,
  Zap,
  ArrowRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';

type HomeView = 'home' | 'how-it-works' | 'dashboard';

interface HomePageProps {
  onNavigate: (view: HomeView) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: Sparkles,
      title: 'Smart Summaries',
      description: 'Get a concise overview of any long conversation in seconds. Our AI reads through every message so you don\'t have to.',
      color: 'from-lavender-400 to-lavender-600',
    },
    {
      icon: CalendarClock,
      title: 'Deadline Detection',
      description: 'Never miss an important date again. We extract exams, meetings, submissions, and events with times and context.',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: AlertCircle,
      title: 'Important Updates',
      description: 'Catch announcements, cancellations, and urgent changes that you might have scrolled past in a busy chat.',
      color: 'from-amber-400 to-orange-500',
    },
  ];

  const steps = [
    {
      icon: ClipboardPaste,
      title: 'Paste',
      description: 'Copy any conversation, group chat, meeting transcript, or announcement into the text area.',
    },
    {
      icon: Cpu,
      title: 'Analyze',
      description: 'Our AI reads through every message and extracts summaries, deadlines, decisions, and tasks.',
    },
    {
      icon: Zap,
      title: 'Catch Up',
      description: 'Get a clear, organized breakdown of everything you missed. Copy it, check off tasks, and stay on top of it.',
    },
  ];

  return (
    <div className="bg-navy-900 min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-lavender-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender-500/10 border border-lavender-500/20 text-lavender-300 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            AI-Powered Conversation Summarizer
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-balance leading-tight mb-6 animate-fade-in-up">
            Hundreds of messages.
            <br />
            <span className="bg-gradient-to-r from-lavender-300 to-lavender-500 bg-clip-text text-transparent">
              Zero confusion.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-navy-200 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Paste your conversation. Get the summary, deadlines, and important updates in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 rounded-xl text-base font-semibold bg-lavender-500 text-white hover:bg-lavender-600 transition-all shadow-xl shadow-lavender-500/20 hover:shadow-lavender-500/30 hover:scale-105 flex items-center gap-2"
            >
              Summarize My Chat
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-8 py-4 rounded-xl text-base font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              How It Works
            </button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-navy-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-lavender-400" />
              Privacy-first
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lavender-400" />
              No sign-up required
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-lavender-400" />
              Results in seconds
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to catch up
            </h2>
            <p className="text-navy-300 text-lg max-w-2xl mx-auto">
              Three powerful tools that turn overwhelming group chats into clear, actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group bg-navy-800 rounded-2xl p-8 border border-white/5 hover:border-lavender-500/30 transition-all hover:shadow-2xl hover:shadow-lavender-500/5 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-navy-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-navy-300 text-lg">
              Three simple steps from overwhelmed to caught up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative text-center">
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-lavender-500/40 to-transparent" />
                  )}
                  <div className="relative inline-flex w-24 h-24 rounded-2xl bg-navy-800 border border-lavender-500/20 items-center justify-center mb-6">
                    <Icon className="w-10 h-10 text-lavender-400" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-lavender-500 text-white text-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-navy-300 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-14">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 rounded-xl text-base font-semibold bg-lavender-500 text-white hover:bg-lavender-600 transition-all shadow-xl shadow-lavender-500/20 hover:scale-105 inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-16 bg-navy-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 bg-navy-800/50 rounded-2xl p-8 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-lavender-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-lavender-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Your Privacy Matters</h3>
              <p className="text-navy-300 leading-relaxed text-sm">
                Conversations are not saved by default. Text is only processed when you click
                analyze, and is never sent to analytics services. When an AI provider is configured,
                your text is sent securely for analysis. Use the Clear Conversation button anytime to
                remove pasted text and results from your screen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function HowItWorksPage({ onNavigate }: HomePageProps) {
  const faqs = [
    {
      q: 'What kind of conversations can I analyze?',
      a: 'Group chats, class announcements, meeting transcripts, Slack threads, Discord conversations, email chains, and any other long text-based conversation. If it has messages and content you need to catch up on, it works.',
    },
    {
      q: 'How accurate are the deadlines and dates?',
      a: 'The AI extracts dates directly from your conversation and preserves the original wording. If a date is ambiguous (like "next Tuesday" or "soon"), it will be flagged as needing confirmation. We never invent dates that aren\'t in the text.',
    },
    {
      q: 'Is my conversation stored anywhere?',
      a: 'No. Conversations are not saved by default. Text is processed only when you click Analyze. When an AI provider is configured, your text is sent to the provider for analysis. Nothing is logged or stored on our servers.',
    },
    {
      q: 'What if there are no deadlines in my conversation?',
      a: 'The app will clearly tell you "No clear deadlines found." We don\'t make things up. If information isn\'t in the conversation, we say so.',
    },
    {
      q: 'Can I use it without an AI API key?',
      a: 'Yes. Demo mode lets you try the full interface with a sample conversation and pre-generated results, so you can see exactly how everything works before connecting a real AI provider.',
    },
  ];

  return (
    <div className="bg-navy-900 min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">How It Works</h1>
        <p className="text-navy-300 text-lg text-center mb-12">
          From overwhelmed to caught up in three simple steps.
        </p>

        <div className="space-y-6 mb-16">
          {[
            { num: '1', title: 'Paste Your Conversation', desc: 'Copy any conversation from your chat app, email, or document and paste it into the text area. Add optional context about what the conversation is about, and select a category to help the AI focus.' },
            { num: '2', title: 'AI Analyzes Every Message', desc: 'Our AI reads through the entire conversation, identifying summaries, important messages, deadlines, decisions, and action items. It preserves original meaning and includes speaker names and source excerpts.' },
            { num: '3', title: 'Review and Act on Results', desc: 'Get organized results in clear sections: Quick Summary, Important Messages, Deadlines, Action Items, Decisions, and Things You Must Not Miss. Copy results, check off tasks, and analyze another conversation anytime.' },
          ].map((step) => (
            <div key={step.num} className="flex gap-5 bg-navy-800 rounded-2xl p-6 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-lavender-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-navy-300 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-navy-800 rounded-xl p-6 border border-white/5">
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-navy-300 leading-relaxed text-sm">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-8 py-4 rounded-xl text-base font-semibold bg-lavender-500 text-white hover:bg-lavender-600 transition-all shadow-xl shadow-lavender-500/20 hover:scale-105 inline-flex items-center gap-2"
          >
            Try It Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
