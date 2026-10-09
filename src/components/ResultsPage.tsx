import { useState } from 'react';
import {
  Sparkles,
  AlertCircle,
  CalendarClock,
  CheckSquare,
  Gavel,
  Star,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  User,
  HelpCircle,
  XCircle,
  CheckCircle2,
  Flag,
  Eraser,
  MessageCircleQuestion,
  Ban,
} from 'lucide-react';
import type { AnalysisResult, ActionItem } from '@/types';

interface ResultsPageProps {
  result: AnalysisResult;
  onAnalyzeAnother: () => void;
  onClearAll: () => void;
}

export function ResultsPage({ result, onAnalyzeAnother, onClearAll }: ResultsPageProps) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [actionItems, setActionItems] = useState<ActionItem[]>(
    result.action_items.map((item) => ({ ...item }))
  );
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());

  const toggleTask = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const toggleMessage = (idx: number) => {
    setExpandedMessages((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const summaryText = result.summary.map((s) => `- ${s}`).join('\n');

  const buildAllText = (): string => {
    const sections: string[] = [];

    sections.push('=== QUICK SUMMARY ===');
    result.summary.forEach((s) => sections.push(`- ${s}`));

    sections.push('\n=== IMPORTANT MESSAGES ===');
    if (result.important_messages.length === 0) {
      sections.push('No important messages found.');
    } else {
      result.important_messages.forEach((m) => {
        const speaker = m.speaker ? `[${m.speaker}] ` : '';
        sections.push(`- ${speaker}(${m.priority.toUpperCase()}) ${m.message}`);
        if (m.source_excerpt) sections.push(`  Source: "${m.source_excerpt}"`);
      });
    }

    sections.push('\n=== DEADLINES & DATES ===');
    if (result.deadlines.length === 0) {
      sections.push('No clear deadlines found.');
    } else {
      result.deadlines.forEach((d) => {
        const dateStr = d.date || 'Date not specified';
        const timeStr = d.time ? ` at ${d.time}` : '';
        const status = d.is_confirmed ? 'Confirmed' : 'Proposed';
        const ambiguity = d.is_ambiguous ? ' [AMBIGUOUS - needs confirmation]' : '';
        const speaker = d.speaker ? ` (mentioned by ${d.speaker})` : '';
        sections.push(`- ${d.description}: ${dateStr}${timeStr} [${status}]${ambiguity}${speaker}`);
        if (d.context) sections.push(`  Context: ${d.context}`);
      });
    }

    sections.push('\n=== ACTION ITEMS ===');
    if (actionItems.length === 0) {
      sections.push('No action items found.');
    } else {
      actionItems.forEach((item) => {
        const check = item.completed ? '[x]' : '[ ]';
        const speaker = item.speaker ? ` (${item.speaker})` : '';
        sections.push(`${check} ${item.task}${speaker}`);
      });
    }

    sections.push('\n=== DECISIONS MADE ===');
    if (result.decisions.length === 0) {
      sections.push('No decisions found.');
    } else {
      result.decisions.forEach((d) => {
        const speaker = d.speaker ? `[${d.speaker}] ` : '';
        sections.push(`- ${speaker}${d.decision}`);
        if (d.context) sections.push(`  Context: ${d.context}`);
      });
    }

    sections.push('\n=== QUESTIONS ===');
    if (result.questions.length === 0) {
      sections.push('No questions found.');
    } else {
      result.questions.forEach((q) => {
        const speaker = q.speaker ? `[${q.speaker}] ` : '';
        const directed = q.directed_at ? ` (to ${q.directed_at})` : '';
        const status = q.is_answered ? 'ANSWERED' : 'UNANSWERED';
        sections.push(`- ${speaker}${directed} [${status}] ${q.question}`);
        if (q.is_answered && q.answer) {
          const ansSpeaker = q.answer_speaker ? `[${q.answer_speaker}] ` : '';
          sections.push(`  Answer: ${ansSpeaker}${q.answer}`);
        }
      });
    }

    sections.push('\n=== CANCELLATIONS & CHANGES ===');
    if (result.cancellations.length === 0) {
      sections.push('No cancellations or changes found.');
    } else {
      result.cancellations.forEach((c) => {
        const speaker = c.speaker ? `[${c.speaker}] ` : '';
        sections.push(`- ${speaker}(${c.type}) ${c.description}`);
        if (c.what_changed) sections.push(`  Change: ${c.what_changed}`);
        if (c.original) sections.push(`  Original: ${c.original}`);
      });
    }

    sections.push('\n=== THINGS YOU MUST NOT MISS ===');
    if (result.must_not_miss.length === 0) {
      sections.push('No critical items identified.');
    } else {
      result.must_not_miss.forEach((item) => {
        sections.push(`- ${item.text}`);
        sections.push(`  Why: ${item.reason}`);
      });
    }

    return sections.join('\n');
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(buildAllText());
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // fallback
    }
  };

  const sortedDeadlines = [...result.deadlines].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  const priorityConfig = {
    high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Urgent' },
    medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Important' },
    low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Noted' },
  };

  const cancellationTypeConfig = {
    cancellation: { label: 'Cancellation', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    change: { label: 'Change', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    updated_instruction: { label: 'Updated Instruction', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  };

  const completedCount = actionItems.filter((a) => a.completed).length;

  return (
    <div className="bg-navy-900 min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo Banner */}
        {result.is_demo && (
          <div className="mb-6 p-4 rounded-xl bg-lavender-500/10 border border-lavender-500/20 flex items-center gap-3 animate-fade-in">
            <Sparkles className="w-5 h-5 text-lavender-300 flex-shrink-0" />
            <p className="text-lavender-200 text-sm font-medium">
              Demo Mode - These results are pre-generated from a sample conversation to show you how the app works.
            </p>
          </div>
        )}

        {!result.is_demo && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-200 text-sm font-medium">
              Analyzed by Google Gemini AI - Results are generated from your actual conversation.
            </p>
          </div>
        )}

        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Your Conversation Analysis</h1>
            <p className="text-navy-300 text-sm">
              {completedCount} of {actionItems.length} tasks completed
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copiedSummary ? 'Copied!' : 'Copy Summary'}
            </button>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              {copiedAll ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? 'Copied!' : 'Copy All Results'}
            </button>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
            >
              <Eraser className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={onAnalyzeAnother}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-lavender-500 text-white hover:bg-lavender-600 transition-all shadow-lg shadow-lavender-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              Analyze Another
            </button>
          </div>
        </div>

        {/* A. Quick Summary */}
        <Section icon={Sparkles} title="Quick Summary" color="lavender">
          <ul className="space-y-3">
            {result.summary.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="w-2 h-2 rounded-full bg-lavender-400 flex-shrink-0 mt-2" />
                <span className="text-navy-100 leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* B. Important Messages */}
        <Section icon={AlertCircle} title="Important Messages" color="amber">
          {result.important_messages.length === 0 ? (
            <EmptyState text="No important messages found." />
          ) : (
            <div className="space-y-3">
              {result.important_messages.map((msg, idx) => {
                const pc = priorityConfig[msg.priority] || priorityConfig.low;
                const isExpanded = expandedMessages.has(idx);
                const hasExcerpt = msg.source_excerpt && msg.source_excerpt.length > 100;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 border ${pc.bg} ${pc.border} animate-fade-in-up`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pc.color} ${pc.bg} border ${pc.border}`}>
                          {pc.label}
                        </span>
                        <span className="text-xs font-medium text-navy-300">{msg.category}</span>
                      </div>
                      {hasExcerpt && (
                        <button
                          onClick={() => toggleMessage(idx)}
                          className="text-navy-400 hover:text-white transition-colors flex-shrink-0"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    <p className="text-white text-sm leading-relaxed">
                      {msg.speaker && <span className="font-semibold text-lavender-300">{msg.speaker}: </span>}
                      {msg.message}
                    </p>
                    {msg.source_excerpt && (
                      <div className={`mt-3 pl-3 border-l-2 border-white/10 ${isExpanded ? '' : 'line-clamp-1'} overflow-hidden`}>
                        <p className="text-navy-400 text-xs italic">"{msg.source_excerpt}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* C. Deadlines and Dates */}
        <Section icon={CalendarClock} title="Deadlines and Dates" color="blue">
          {sortedDeadlines.length === 0 ? (
            <EmptyState text="No clear deadlines found." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedDeadlines.map((deadline, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4 bg-navy-700/50 border border-white/5 hover:border-white/10 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm mb-1">{deadline.description}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-300">
                        {deadline.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {deadline.date}
                          </span>
                        )}
                        {deadline.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {deadline.time}
                          </span>
                        )}
                      </div>
                      {deadline.speaker && (
                        <p className="text-xs text-navy-400 mt-1 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {deadline.speaker}
                        </p>
                      )}
                      {deadline.context && (
                        <p className="text-navy-300 text-xs mt-2 leading-relaxed">{deadline.context}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${deadline.is_confirmed ? 'text-green-400 bg-green-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                          {deadline.is_confirmed ? <CheckCircle2 className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                          {deadline.is_confirmed ? 'Confirmed' : 'Proposed'}
                        </span>
                        {deadline.is_ambiguous && (
                          <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-orange-400 bg-orange-500/10">
                            <HelpCircle className="w-3 h-3" />
                            Needs Confirmation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* D. Action Items */}
        <Section icon={CheckSquare} title="Action Items" color="green">
          {actionItems.length === 0 ? (
            <EmptyState text="No action items found." />
          ) : (
            <div className="space-y-2">
              {actionItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleTask(item.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-navy-700/50 border border-white/5 hover:border-lavender-500/30 transition-all text-left group"
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.completed ? 'bg-green-500 border-green-500' : 'border-navy-400 group-hover:border-lavender-400'}`}>
                    {item.completed && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm flex-1 transition-all ${item.completed ? 'text-navy-400 line-through' : 'text-white'}`}>
                    {item.task}
                  </span>
                  {item.speaker && (
                    <span className="text-xs text-lavender-300 font-medium flex items-center gap-1 flex-shrink-0">
                      <User className="w-3 h-3" />
                      {item.speaker}
                    </span>
                  )}
                </button>
              ))}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-sm">
                <span className="text-navy-300">Progress</span>
                <span className="text-white font-medium">
                  {completedCount} / {actionItems.length} completed
                </span>
              </div>
              <div className="h-2 rounded-full bg-navy-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / actionItems.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </Section>

        {/* E. Decisions Made */}
        <Section icon={Gavel} title="Decisions Made" color="lavender">
          {result.decisions.length === 0 ? (
            <EmptyState text="No decisions found." />
          ) : (
            <div className="space-y-3">
              {result.decisions.map((decision, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4 bg-navy-700/50 border border-white/5 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-lavender-500/10 flex items-center justify-center flex-shrink-0">
                      <Gavel className="w-4 h-4 text-lavender-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm leading-relaxed">
                        {decision.speaker && <span className="font-semibold text-lavender-300">{decision.speaker}: </span>}
                        {decision.decision}
                      </p>
                      {decision.context && (
                        <p className="text-navy-400 text-xs mt-2 leading-relaxed">{decision.context}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* F. Questions */}
        <Section icon={MessageCircleQuestion} title="Questions" color="blue">
          {result.questions.length === 0 ? (
            <EmptyState text="No questions found in this conversation." />
          ) : (
            <div className="space-y-3">
              {result.questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 border animate-fade-in-up ${q.is_answered ? 'bg-green-500/5 border-green-500/15' : 'bg-amber-500/5 border-amber-500/15'}`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${q.is_answered ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
                      <MessageCircleQuestion className={`w-4 h-4 ${q.is_answered ? 'text-green-400' : 'text-amber-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm leading-relaxed">
                        {q.speaker && <span className="font-semibold text-lavender-300">{q.speaker}: </span>}
                        {q.question}
                      </p>
                      {q.directed_at && (
                        <p className="text-navy-400 text-xs mt-1">Directed at: {q.directed_at}</p>
                      )}
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${q.is_answered ? 'text-green-400 bg-green-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                          {q.is_answered ? <CheckCircle2 className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                          {q.is_answered ? 'Answered' : 'Unanswered - may need your response'}
                        </span>
                      </div>
                      {q.is_answered && q.answer && (
                        <div className="mt-3 pl-3 border-l-2 border-green-500/30">
                          <p className="text-navy-200 text-sm leading-relaxed">
                            {q.answer_speaker && <span className="font-semibold text-green-300">{q.answer_speaker}: </span>}
                            {q.answer}
                          </p>
                        </div>
                      )}
                      {q.source_excerpt && (
                        <p className="text-navy-400 text-xs italic mt-2">"{q.source_excerpt}"</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* G. Cancellations and Changes */}
        <Section icon={Ban} title="Cancellations & Changes" color="amber">
          {result.cancellations.length === 0 ? (
            <EmptyState text="No cancellations or changes found." />
          ) : (
            <div className="space-y-3">
              {result.cancellations.map((c, idx) => {
                const tc = cancellationTypeConfig[c.type as keyof typeof cancellationTypeConfig] || cancellationTypeConfig.change;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 border ${tc.bg} ${tc.border} animate-fade-in-up`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tc.bg}`}>
                        <Ban className={`w-4 h-4 ${tc.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tc.color} ${tc.bg} border ${tc.border}`}>
                            {tc.label}
                          </span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">
                          {c.speaker && <span className="font-semibold text-lavender-300">{c.speaker}: </span>}
                          {c.description}
                        </p>
                        {c.what_changed && (
                          <p className="text-navy-300 text-xs mt-2 leading-relaxed">
                            <span className="font-medium text-navy-200">Changed: </span>
                            {c.what_changed}
                          </p>
                        )}
                        {c.original && (
                          <p className="text-navy-400 text-xs mt-1 leading-relaxed">
                            <span className="font-medium">Original: </span>
                            {c.original}
                          </p>
                        )}
                        {c.source_excerpt && (
                          <p className="text-navy-400 text-xs italic mt-2">"{c.source_excerpt}"</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* H. Things You Must Not Miss */}
        <Section icon={Star} title="Things You Must Not Miss" color="red">
          {result.must_not_miss.length === 0 ? (
            <EmptyState text="No critical items identified." />
          ) : (
            <div className="space-y-3">
              {result.must_not_miss.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4 bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <Flag className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm leading-relaxed">{item.text}</p>
                      <p className="text-navy-300 text-xs mt-1.5 leading-relaxed">
                        <span className="text-red-300 font-medium">Why: </span>
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onAnalyzeAnother}
            className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-lavender-500 text-white hover:bg-lavender-600 transition-all shadow-lg shadow-lavender-500/20 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Analyze Another Conversation
          </button>
          <button
            onClick={onClearAll}
            className="px-6 py-3.5 rounded-xl text-sm font-medium text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Clear Conversation & Results
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

type SectionColor = 'lavender' | 'amber' | 'blue' | 'green' | 'red';

const colorMap: Record<SectionColor, { icon: string; border: string; glow: string }> = {
  lavender: { icon: 'text-lavender-400', border: 'border-lavender-500/20', glow: 'shadow-lavender-500/5' },
  amber: { icon: 'text-amber-400', border: 'border-amber-500/20', glow: 'shadow-amber-500/5' },
  blue: { icon: 'text-blue-400', border: 'border-blue-500/20', glow: 'shadow-blue-500/5' },
  green: { icon: 'text-green-400', border: 'border-green-500/20', glow: 'shadow-green-500/5' },
  red: { icon: 'text-red-400', border: 'border-red-500/20', glow: 'shadow-red-500/5' },
};

function Section({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: SectionColor;
  children: React.ReactNode;
}) {
  const c = colorMap[color];
  return (
    <div className={`mb-6 bg-navy-800 rounded-2xl p-6 border border-white/5 shadow-xl ${c.glow} animate-fade-in-up`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-navy-700/30 border border-white/5">
      <HelpCircle className="w-5 h-5 text-navy-400" />
      <p className="text-navy-300 text-sm">{text}</p>
    </div>
  );
}
