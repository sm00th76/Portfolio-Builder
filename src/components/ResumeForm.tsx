import React, { useState } from 'react';
import { PortfolioConfig } from '../types';
import { Sparkles, Code, Palette, MessageSquare, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface ResumeFormProps {
  onGenerate: (config: PortfolioConfig) => void;
  isLoading: boolean;
}

export default function ResumeForm({ onGenerate, isLoading }: ResumeFormProps) {
  const [config, setConfig] = useState<PortfolioConfig>({
    resumeText: '',
    techStack: 'React + Tailwind',
    style: 'Modern & Minimal',
    customInstructions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(config);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight mb-4 font-serif italic">Portfolio Architect</h1>
        <p className="text-slate-500 text-lg mb-6">Transform your resume into a stunning professional website in seconds.</p>
        <button 
          type="button"
          onClick={() => setConfig({
            ...config,
            resumeText: `John Doe\nFull Stack Developer\n\nExperience:\n- Senior Dev at TechCorp (2020-Present): Led React migration, improved performance by 40%.\n- Junior Dev at StartUpInc (2018-2020): Built mobile-first features using Vue.\n\nSkills: React, Node.js, TypeScript, Tailwind, AWS.\n\nEducation: BS in Computer Science, University of Technology.`
          })}
          className="text-brand-600 text-sm font-medium hover:underline"
        >
          Try with sample data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 glass p-8 rounded-3xl">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
            <FileText size={16} />
            Resume or Details
          </label>
          <textarea
            required
            className="w-full h-64 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none font-sans"
            placeholder="Paste your resume content or describe your professional background..."
            value={config.resumeText}
            onChange={(e) => setConfig({ ...config, resumeText: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
              <Code size={16} />
              Tech Stack
            </label>
            <select
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 transition-all"
              value={config.techStack}
              onChange={(e) => setConfig({ ...config, techStack: e.target.value })}
            >
              <option>React + Tailwind</option>
              <option>Next.js + Framer Motion</option>
              <option>HTML + CSS + Vanilla JS</option>
              <option>Vue + Vite</option>
              <option>Astro + Tailwind</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
              <Palette size={16} />
              Visual Style
            </label>
            <select
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 transition-all"
              value={config.style}
              onChange={(e) => setConfig({ ...config, style: e.target.value })}
            >
              <option>Modern & Minimal</option>
              <option>Brutalist & Bold</option>
              <option>Professional & Corporate</option>
              <option>Creative & Playful</option>
              <option>Dark Mode Luxury</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
            <MessageSquare size={16} />
            Custom Instructions (Optional)
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 transition-all"
            placeholder="e.g. 'Use a neon green accent color', 'Include a blog section'..."
            value={config.customInstructions}
            onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <>
              Generate My Portfolio
              <Sparkles className="group-hover:animate-pulse" size={20} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
