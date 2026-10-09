const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAX_INPUT_LENGTH = 200000;
const CHUNK_SIZE = 25000;
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_MAX_OUTPUT = 8192;

const SYSTEM_PROMPT = `You are an expert conversation analyst specializing in WhatsApp chats, group conversations, meeting transcripts, and announcements. Your job is to analyze the provided conversation and extract structured information.

You MUST follow these rules strictly:
1. NEVER invent deadlines, names, times, decisions, or answers that are not in the conversation.
2. If a date or time is ambiguous or relative (e.g., "next Tuesday", "soon", "by Friday"), include it but set is_ambiguous to true and note in the context what the original wording was.
3. If a date was proposed but not confirmed, set is_confirmed to false.
4. If there are no items for a section, return an empty array for that section.
5. Preserve the original meaning of every extracted item.
6. Include the speaker's name when available (WhatsApp format is typically "[timestamp] Name: message").
7. Include a short source excerpt (direct quote from the conversation) when available.
8. Summarize in simple, clear language.
9. For the summary, provide 3-7 bullet points depending on conversation length.
10. For important_messages, assign priority as "high", "medium", or "low" based on urgency.
11. For must_not_miss, list the most critical items that a person absolutely needs to know.
12. For action_items, generate a unique id for each (format: "ai-1", "ai-2", etc.).
13. For questions, identify questions directed at specific people or the group. Set is_answered to true only if an answer is found in the conversation. If the question appears unanswered, set is_answered to false and answer to null.
14. For cancellations, identify cancellations, changes to plans, and updated instructions. Specify the type, what changed, and the original plan if known.
15. Distinguish proposed dates from confirmed deadlines.

Return ONLY valid JSON matching this exact schema:
{
  "summary": ["bullet point 1", "bullet point 2", ...],
  "important_messages": [
    {
      "speaker": "name or null",
      "message": "the important message",
      "category": "category type (e.g., Announcement, Deadline, Cancellation, Decision, Request, Urgent Update)",
      "priority": "high" | "medium" | "low",
      "source_excerpt": "direct quote or null"
    }
  ],
  "deadlines": [
    {
      "description": "what the deadline is for",
      "date": "parsed date string or null",
      "time": "parsed time string or null",
      "is_confirmed": boolean,
      "is_ambiguous": boolean,
      "context": "additional context about this deadline",
      "speaker": "name or null"
    }
  ],
  "action_items": [
    {
      "id": "ai-1",
      "task": "the task description",
      "speaker": "who should do it, or null",
      "completed": false
    }
  ],
  "decisions": [
    {
      "decision": "the decision made",
      "speaker": "name or null",
      "context": "context around the decision"
    }
  ],
  "must_not_miss": [
    {
      "text": "the critical item",
      "reason": "why this must not be missed"
    }
  ],
  "questions": [
    {
      "question": "the question that was asked",
      "speaker": "who asked it, or null",
      "directed_at": "who it was directed at, or null",
      "is_answered": boolean,
      "answer": "the answer if found, or null",
      "answer_speaker": "who answered, or null",
      "source_excerpt": "direct quote or null"
    }
  ],
  "cancellations": [
    {
      "type": "cancellation" | "change" | "updated_instruction",
      "description": "what was cancelled/changed/updated",
      "what_changed": "details of the change",
      "original": "the original plan or instruction, or null",
      "speaker": "name or null",
      "source_excerpt": "direct quote or null"
    }
  ]
}

Return ONLY the JSON object, no markdown formatting, no explanation.`;

const CONSOLIDATION_PROMPT = `You are consolidating multiple partial analyses of a long conversation into a single unified analysis. Each partial analysis covers a chunk of the conversation.

Merge all the partial results into one coherent analysis:
1. Combine summary bullet points, removing duplicates and keeping the most important ones (aim for 3-7 total).
2. Merge important_messages, removing duplicates.
3. Merge deadlines, removing duplicates. If the same deadline appears with different details, merge the information.
4. Merge action_items, removing duplicates. Renumber IDs as ai-1, ai-2, etc.
5. Merge decisions, removing duplicates.
6. Merge must_not_miss, keeping the most critical items (aim for 3-7 total).
7. Merge questions, removing duplicates. If a question appears as unanswered in one chunk but answered in another, mark it as answered with the answer.
8. Merge cancellations, removing duplicates.

Return ONLY valid JSON matching the same schema as the input partial analyses. No markdown, no explanation.`;

interface RequestBody {
  conversation: string;
  context: string;
  category: string;
}

interface PartialAnalysis {
  summary: string[];
  important_messages: Array<{
    speaker: string | null;
    message: string;
    category: string;
    priority: string;
    source_excerpt: string | null;
  }>;
  deadlines: Array<{
    description: string;
    date: string | null;
    time: string | null;
    is_confirmed: boolean;
    is_ambiguous: boolean;
    context: string;
    speaker: string | null;
  }>;
  action_items: Array<{
    id: string;
    task: string;
    speaker: string | null;
    completed: boolean;
  }>;
  decisions: Array<{
    decision: string;
    speaker: string | null;
    context: string;
  }>;
  must_not_miss: Array<{
    text: string;
    reason: string;
  }>;
  questions: Array<{
    question: string;
    speaker: string | null;
    directed_at: string | null;
    is_answered: boolean;
    answer: string | null;
    answer_speaker: string | null;
    source_excerpt: string | null;
  }>;
  cancellations: Array<{
    type: string;
    description: string;
    what_changed: string;
    original: string | null;
    speaker: string | null;
    source_excerpt: string | null;
  }>;
}

async function callGemini(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: GEMINI_MAX_OUTPUT,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText.substring(0, 200)}`);
  }

  const result = await response.json();
  const content = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error("Gemini returned an empty response");
  }

  return content;
}

function parseJsonResponse(content: string): PartialAnalysis {
  const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

function chunkConversation(text: string): string[] {
  if (text.length <= CHUNK_SIZE) {
    return [text];
  }

  const chunks: string[] = [];
  const lines = text.split("\n");
  let currentChunk = "";

  for (const line of lines) {
    if (currentChunk.length + line.length + 1 > CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = line + "\n";
    } else {
      currentChunk += line + "\n";
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { conversation, context, category } = body;

    if (!conversation || conversation.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No conversation text provided." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (conversation.length > MAX_INPUT_LENGTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Conversation is too long. Please limit to ${MAX_INPUT_LENGTH.toLocaleString()} characters.`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    if (!geminiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "AI provider not configured. Add the GEMINI_API_KEY secret to enable real AI analysis. You can use Demo Mode to try the interface.",
          needs_demo: true,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const chunks = chunkConversation(conversation);

    if (chunks.length === 1) {
      const userPrompt = `Category: ${category}
${context ? `Context: ${context}` : "No additional context provided."}

Conversation to analyze:
"""
${conversation}
"""

Analyze this conversation and return the structured JSON as specified.`;

      const content = await callGemini(geminiKey, SYSTEM_PROMPT, userPrompt);
      const parsed = parseJsonResponse(content);

      return new Response(
        JSON.stringify({ success: true, data: parsed, is_demo: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Multi-chunk: analyze each chunk, then consolidate
    const partialResults: PartialAnalysis[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkPrompt = `Category: ${category}
${context ? `Context: ${context}` : "No additional context provided."}

This is part ${i + 1} of ${chunks.length} of a long conversation. Analyze this portion:

"""
${chunks[i]}
"""

Analyze this portion and return the structured JSON as specified.`;

      const content = await callGemini(geminiKey, SYSTEM_PROMPT, chunkPrompt);
      const parsed = parseJsonResponse(content);
      partialResults.push(parsed);
    }

    const consolidationPrompt = `Here are ${partialResults.length} partial analyses from different chunks of a long conversation. Consolidate them into a single unified analysis.

${JSON.stringify(partialResults, null, 2)}

Return the consolidated JSON analysis following the same schema. Remove duplicates and merge related items.`;

    const consolidatedContent = await callGemini(geminiKey, CONSOLIDATION_PROMPT, consolidationPrompt);
    const consolidated = parseJsonResponse(consolidatedContent);

    return new Response(
      JSON.stringify({ success: true, data: consolidated, is_demo: false }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";

    if (message.includes("API key") || message.includes("403") || message.includes("401")) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "The Gemini API key is missing or invalid. Please check your GEMINI_API_KEY configuration.",
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: message.includes("Gemini API error")
          ? "The AI service encountered an error. Please try again in a moment."
          : "Could not complete the analysis. Please try again.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
