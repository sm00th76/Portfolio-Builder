import { GoogleGenAI, Type } from "@google/genai";
import { PortfolioConfig, GenerationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function getTechStackRequirements(techStack: string): string {
  const rulesByStack: Record<string, string> = {
    "React + Tailwind": `
TECH STACK IMPLEMENTATION: React + Tailwind (Vite + TypeScript)

Required folder structure:
- package.json
- tsconfig.json
- vite.config.ts
- index.html
- postcss.config.js
- tailwind.config.js
- src/main.tsx
- src/App.tsx
- src/index.css
- src/components/Hero.tsx
- src/components/About.tsx
- src/components/Experience.tsx
- src/components/Projects.tsx
- src/components/Skills.tsx
- src/components/Contact.tsx

Use this exact package.json dependency format and include "type": "module":
{
  "name": "portfolio-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.3",
    "vite": "^5.3.4"
  }
}
`,
    "Next.js + Framer Motion": `
TECH STACK IMPLEMENTATION: Next.js + Framer Motion (App Router + TypeScript)

Required folder structure:
- package.json
- tsconfig.json
- next.config.mjs
- app/layout.tsx
- app/page.tsx
- app/globals.css
- components/Hero.tsx
- components/About.tsx
- components/Experience.tsx
- components/Projects.tsx
- components/Skills.tsx
- components/Contact.tsx

Use this exact package.json dependency format and include "type": "module":
{
  "name": "portfolio-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "framer-motion": "^11.3.19",
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.12",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.5",
    "typescript": "^5.5.3"
  }
}
`,
    "HTML + CSS + Vanilla JS": `
TECH STACK IMPLEMENTATION: HTML + CSS + Vanilla JS

Required folder structure:
- index.html
- style.css
- script.js
- assets/images/ (optional placeholders)

Dependency rule:
- This stack must have no package.json.
- In explanation, explicitly write: "no dependencies".
`,
    "Vue + Vite": `
TECH STACK IMPLEMENTATION: Vue + Vite (TypeScript)

Required folder structure:
- package.json
- tsconfig.json
- vite.config.ts
- index.html
- src/main.ts
- src/App.vue
- src/style.css
- src/components/HeroSection.vue
- src/components/AboutSection.vue
- src/components/ExperienceSection.vue
- src/components/ProjectsSection.vue
- src/components/SkillsSection.vue
- src/components/ContactSection.vue

Use this exact package.json dependency format and include "type": "module":
{
  "name": "portfolio-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.31"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.5",
    "typescript": "^5.5.3",
    "vite": "^5.3.4",
    "vue-tsc": "^2.0.26"
  }
}
`,
    "Astro + Tailwind": `
TECH STACK IMPLEMENTATION: Astro + Tailwind (TypeScript)

Required folder structure:
- package.json
- tsconfig.json
- astro.config.mjs
- src/pages/index.astro
- src/layouts/BaseLayout.astro
- src/components/Hero.astro
- src/components/About.astro
- src/components/Experience.astro
- src/components/Projects.astro
- src/components/Skills.astro
- src/components/Contact.astro
- src/styles/global.css

Use this exact package.json dependency format and include "type": "module":
{
  "name": "portfolio-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/tailwind": "^5.1.0",
    "astro": "^4.12.3",
    "tailwindcss": "^3.4.7"
  },
  "devDependencies": {
    "typescript": "^5.5.3"
  }
}
`
  };

  return rulesByStack[techStack] || rulesByStack["React + Tailwind"];
}

function parseGenerationResult(rawText: string | undefined): GenerationResult {
  if (!rawText) {
    throw new Error("Empty model response");
  }

  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as Partial<GenerationResult>;

  if (!Array.isArray(parsed.files) || typeof parsed.explanation !== "string") {
    throw new Error("Invalid generation payload format");
  }

  const files = parsed.files.filter(
    (file): file is { path: string; content: string } =>
      Boolean(file) &&
      typeof file.path === "string" &&
      file.path.length > 0 &&
      typeof file.content === "string"
  );

  return {
    files,
    explanation: parsed.explanation
  };
}

export async function generatePortfolio(config: PortfolioConfig): Promise<GenerationResult> {
  const model = "gemini-2.5-flash";

  const techStackRequirements = getTechStackRequirements(config.techStack);

  const prompt = `
You are an expert senior web developer.

Your task is to generate a COMPLETE, production-ready portfolio website project.

========================
📌 INPUT DETAILS
========================

RESUME / DETAILS:
${config.resumeText}

TECH STACK:
${config.techStack}

STYLE PREFERENCE:
${config.style}

CUSTOM INSTRUCTIONS:
${config.customInstructions}

SELECTED TECH STACK REQUIREMENTS:
${techStackRequirements}

========================
📌 CRITICAL FORMATTING RULES (MANDATORY)
========================

- EVERY statement MUST be on a new line.
- NEVER write multiple statements on a single line.
- AFTER every semicolon (;) you MUST insert a newline.
- Use proper indentation (2 or 4 spaces consistently).
- Opening and closing brackets must be on separate lines where appropriate.
- Each JSX/HTML tag must be on its own line.
- Each CSS property must be on its own line.
- Each import must be on its own line.
- DO NOT compress code into one line under ANY circumstance.

Example (CORRECT):
const a = 10;
const b = 20;

function test() {
  return a + b;
}

Example (WRONG):
const a = 10; const b = 20; function test(){return a+b;}

========================
📌 REQUIREMENTS
========================

1. PROJECT STRUCTURE
- Generate a full project structure.
- Include ALL necessary files.
- MUST include:
  - package.json (for React or frameworks)
  - OR explicitly state "no dependencies" for vanilla

2. CODE QUALITY
- Code must look like it was written in VS Code with Prettier enabled.
- Clean, readable, modular.

3. TECH-SPECIFIC RULES

IF React:
- Use functional components
- Provide:
  - package.json
  - App.tsx / App.jsx
  - index.tsx / main.tsx
  - index.css
  - components folder

IF HTML/CSS/JS:
- Provide:
  - index.html
  - style.css
  - script.js

FOR ALL NODE-BASED STACKS (React, Next.js, Vue, Astro):
- package.json must include "type": "module".
- package.json must include "dependencies" and "devDependencies" objects.
- Include scripts needed to run dev and production builds.
- Include each required config file for that stack.
- Do not omit files imported anywhere in the generated code.
-If the user selects Next.js, ensure the package.json contains: 
  scripts: { 'dev': 'next dev' } and all necessary dependencies like next, react, react-dom, lucide-react, tailwindcss, postcss, and autoprefixer.
-If the user selects React + Tailwind, ensure the package.json contains:
  scripts: { 'dev': 'vite' } and includes @vitejs/plugin-react.

4. DESIGN
- Modern, responsive
- Matches STYLE PREFERENCE
- Use Unsplash/Picsum placeholders

5. SECTIONS
- Hero
- About
- Experience
- Projects
- Skills
- Contact

========================
📌 OUTPUT FORMAT (STRICT JSON)
========================

Return ONLY:

{
  "files": [
    {
      "path": "file/path",
      "content": "CODE WITH REAL LINE BREAKS (\\n), NOT ONE LINE"
    }
  ],
  "explanation": "brief explanation"
}

========================
🚨 FINAL ENFORCEMENT
========================

- If any file contains code in a SINGLE LINE → RESPONSE IS INVALID
- If newlines (\\n) are missing → RESPONSE IS INVALID
- Code MUST contain visible line breaks and indentation
- DO NOT wrap code in markdown
- DO NOT compress output
- Return raw JSON object only.
- Do not include code fences.

The output must be directly pasteable into a code editor and appear properly formatted.

- Treat each file content as if it will be linted by Prettier and ESLint.
- Assume poorly formatted code will cause a build failure.

`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
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

  return parseGenerationResult(response.text);
}