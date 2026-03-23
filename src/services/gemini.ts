import { GoogleGenAI, Type } from "@google/genai";
import { PortfolioConfig, GenerationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function getTechStackRequirements(techStack: string): string {
  const rulesByStack: Record<string, string> = {
    "React + Tailwind": `
- TECH STACK: React + Tailwind (Vite)
- CRITICAL: package.json MUST have "scripts": { "dev": "vite" }.
- DEPENDENCIES: Include react, react-dom, lucide-react, clsx, tailwind-merge.
- DEV-DEPENDENCIES: Include vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer.
- CONFIG FILES: Must generate vite.config.ts, postcss.config.js, tailwind.config.js.
`,
    "Next.js + Framer Motion": `
- TECH STACK: Next.js + Framer Motion (App Router)
- CRITICAL: package.json MUST have "scripts": { "dev": "next dev" }. NEVER use "next start".
- DEPENDENCIES: Include next, react, react-dom, framer-motion, lucide-react.
- DEV-DEPENDENCIES: Include tailwindcss, postcss, autoprefixer, typescript, @types/node, @types/react.
- CONFIG FILES: Must generate next.config.mjs, postcss.config.js, and tailwind.config.js.
`,
    "HTML + CSS + Vanilla JS": `
- TECH STACK: HTML + CSS + Vanilla JS
- CRITICAL: This stack must have NO package.json.
- FILES: Generate only index.html, style.css, script.js.
`,
    "Vue + Vite": `
- TECH STACK: Vue 3 + Vite + Tailwind
- CRITICAL: package.json MUST have "scripts": { "dev": "vite" }.
- DEPENDENCIES: Include vue, lucide-vue-next.
- DEV-DEPENDENCIES: Include vite, @vitejs/plugin-vue, tailwindcss, postcss, autoprefixer.
- CONFIG FILES: Must generate vite.config.ts, postcss.config.js, tailwind.config.js.
`,
    "Astro + Tailwind": `
- TECH STACK: Astro + Tailwind
- CRITICAL: package.json MUST have "scripts": { "dev": "astro dev" }.
- DEPENDENCIES: Include astro, @astrojs/tailwind, tailwindcss.
- CONFIG FILES: Must generate astro.config.mjs, tailwind.config.js.
`
  };

  return rulesByStack[techStack] || rulesByStack["React + Tailwind"];
}

function parseGenerationResult(rawText: string | undefined): GenerationResult {
  if (!rawText) {
    throw new Error("Empty or undefined model response");
  }

  // Gemini's JSON mode is usually clean, but this handles edge cases
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as Partial<GenerationResult>;

  if (!Array.isArray(parsed.files) || typeof parsed.explanation !== "string") {
    throw new Error("AI returned an invalid JSON structure. Missing 'files' or 'explanation'.");
  }

  return {
    files: parsed.files,
    explanation: parsed.explanation
  };
}

export async function generatePortfolio(config: PortfolioConfig): Promise<GenerationResult> {
  const model = "gemini-2.5-flash"; // Using 2.5-flash as it's excellent with JSON
  const techStackRequirements = getTechStackRequirements(config.techStack);

  const prompt = `
    You are an expert web developer. Your task is to generate a complete portfolio website project as a single, raw JSON object.

    **USER DETAILS:**
    - Resume: ${config.resumeText}
    - Style: ${config.style}
    - Custom Instructions: ${config.customInstructions}

    **TECH STACK & RULES:**
    ${techStackRequirements}

    **GENERAL RULES:**
    1.  The code must be production-quality, readable, and fully functional.
    2.  All framework-based projects MUST include a complete \`package.json\` with \`"type": "module"\` and a working \`"dev"\` script.
    3.  All file content MUST contain proper line breaks (\\n) and indentation. Do NOT return single-line code.
    4.  Generate all necessary config files (e.g., vite.config.ts, next.config.mjs).

    **OUTPUT FORMAT (Strict JSON Object):**
    Return ONLY a raw JSON object matching this schema. Do NOT use markdown fences.
    {
      "files": [ { "path": "string", "content": "string" } ],
      "explanation": "string"
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    // ✅ FIX 1: The correct property name is 'config', not 'generationConfig'.
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                path: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["path", "content"]
            }
          },
          explanation: { type: Type.STRING }
        },
        required: ["files", "explanation"]
      }
    }
  });

  // ✅ FIX 2: The text content is on the root object, not nested in '.response'.
  // ✅ CORRECT: Accessing .text as a property
  return parseGenerationResult(response.text);
}