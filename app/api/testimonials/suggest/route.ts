import { NextRequest, NextResponse } from "next/server";

type SuggestRequest = {
  name?: string;
  handle?: string;
  rating?: number;
  clickId?: number;
  previousSuggestions?: string[];
};

type SuggestResponse = {
  success: boolean;
  suggestion?: string;
  error?: string;
};

const SYSTEM_PROMPT =
  "You write natural, believable customer testimonials for SaaS products. Return only one polished paragraph in plain text, max 90 words. Keep it positive but realistic. No emojis. Avoid repetitive phrasing and avoid generic openings.";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(text: string): Set<string> {
  return new Set(normalize(text).split(" ").filter((t) => t.length > 2));
}

function jaccardSimilarity(a: string, b: string): number {
  const aSet = tokenSet(a);
  const bSet = tokenSet(b);

  if (aSet.size === 0 && bSet.size === 0) return 1;
  if (aSet.size === 0 || bSet.size === 0) return 0;

  let intersection = 0;
  for (const token of aSet) {
    if (bSet.has(token)) {
      intersection += 1;
    }
  }

  const union = new Set([...aSet, ...bSet]).size;
  return union === 0 ? 0 : intersection / union;
}

function isTooSimilar(candidate: string, previousSuggestions: string[]): boolean {
  const maxSimilarity = previousSuggestions.reduce((max, prev) => {
    return Math.max(max, jaccardSimilarity(candidate, prev));
  }, 0);

  return maxSimilarity >= 0.62;
}

function hasOverusedOpening(candidate: string): boolean {
  const opening = normalize(candidate).split(" ").slice(0, 6).join(" ");
  const blocked = [
    "social insight helped me clearly",
    "as creator i used",
    "based on my experience",
    "i used social insight to",
  ];

  return blocked.some((phrase) => opening.includes(phrase));
}

function buildUserPrompt(name: string, handle: string, rating: number): string {
  return `Write a first-person testimonial for Social Insight.
Use this user data naturally in the message:
- Name: ${name}
- Username: ${handle}
- Rating: ${rating}/5

Mention better clarity, improved content strategy, and stronger engagement.`;
}

function fallbackSuggestion(name: string, handle: string, rating: number, clickId: number): string {
  const safeHandle = handle.startsWith("@") ? handle : `@${handle}`;
  const templates = [
    `${name} here (${safeHandle}). I gave Social Insight a ${rating}/5 because it translated my profile data into a focused action plan. I adjusted posting rhythm, tightened hooks, and aligned captions with audience intent. Within a few weeks, engagement became more consistent and collaborations felt easier to negotiate.`,
    `I am ${name} (${safeHandle}), and this felt like a practical growth coach in dashboard form. My ${rating}/5 rating comes from how clearly it exposed weak content patterns and helped me fix them fast. After applying its suggestions, my content direction got sharper and audience response improved post by post.`,
    `For my account ${safeHandle}, Social Insight turned guesswork into clear decisions. I would rate it ${rating}/5 because the recommendations were specific, not generic. I improved timing, refined my content pillars, and started seeing stronger engagement quality, not just vanity spikes.`,
    `As ${name} (${safeHandle}), I needed structure, and Social Insight delivered exactly that. I rate it ${rating}/5 because it helped me prioritize high-impact changes first. My posting strategy became cleaner, my messaging became more consistent, and the audience interaction trend moved in the right direction.`
  ];
  return templates[Math.abs(clickId) % templates.length];
}

async function tryGemini(
  name: string,
  handle: string,
  rating: number,
  clickId: number,
  previousSuggestions: string[]
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const styles = ["professional", "friendly", "results-driven", "storytelling", "bold", "analytical"];
  const structures = [
    "Open with a concrete before/after outcome",
    "Open with a specific challenge, then solution",
    "Open with a short opinion, then evidence",
    "Open with timing context, then impact",
    "Open with strategy shift, then result",
  ];
  const chosenStyle = styles[Math.abs(clickId) % styles.length];
  const chosenStructure = structures[Math.abs(clickId) % structures.length];
  const recentAvoid = previousSuggestions.slice(-5).join("\n- ");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${SYSTEM_PROMPT}

Variation rules:
- Use tone: ${chosenStyle}
- Use structure: ${chosenStructure}
- Make this output different from prior outputs.
- Keep it as one paragraph.
- Do not start with "Social Insight helped me".
- Do not copy sentence patterns from previous outputs.

Avoid producing text similar to these previous suggestions:
- ${recentAvoid || "(none)"}

${buildUserPrompt(name, handle, rating)}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 1,
          maxOutputTokens: 180,
        },
      }),
    }
  );

  if (!response.ok) return null;
  const data = await response.json();
  const suggestion = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return typeof suggestion === "string" && suggestion.trim() ? suggestion.trim() : null;
}

async function generateWithAI(
  name: string,
  handle: string,
  rating: number,
  clickId: number,
  previousSuggestions: string[]
): Promise<string> {
  const maxAttempts = 4;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const suggestion = await tryGemini(name, handle, rating, clickId + attempt, previousSuggestions);

      if (!suggestion) {
        continue;
      }

      if (previousSuggestions.includes(suggestion)) {
        continue;
      }

      if (isTooSimilar(suggestion, previousSuggestions)) {
        continue;
      }

      if (hasOverusedOpening(suggestion)) {
        continue;
      }

      return suggestion;
    } catch {
      // Retry with next attempt variation.
    }
  }

  return fallbackSuggestion(name, handle, rating, clickId);
}

export async function POST(request: NextRequest) {
  try {
    const body: SuggestRequest = await request.json();

    const name = (body.name || "Creator").trim();
    const rawHandle = (body.handle || "@creator").trim();
    const handle = rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`;
    const rating = typeof body.rating === "number" && body.rating >= 1 && body.rating <= 5 ? body.rating : 5;
    const clickId = typeof body.clickId === "number" ? body.clickId : Date.now();
    const previousSuggestions = Array.isArray(body.previousSuggestions)
      ? body.previousSuggestions.filter((v): v is string => typeof v === "string")
      : [];

    const suggestion = await generateWithAI(name, handle, rating, clickId, previousSuggestions);

    return NextResponse.json<SuggestResponse>({ success: true, suggestion });
  } catch {
    return NextResponse.json<SuggestResponse>(
      { success: false, error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
