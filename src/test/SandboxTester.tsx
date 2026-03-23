import React, { useState } from 'react';
import ProjectWorkspace from '../components/ProjectWorkspace';
import { mockHtmlProject, mockReactProject, mockNextProject } from './fixtures/mockProjects';
import { GenerationResult } from '../types';

type ProjectType = 'html' | 'react' | 'next';

export default function SandboxTester() {
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectType>('html');

  const projects: Record<ProjectType, GenerationResult> = {
    html: mockHtmlProject,
    react: mockReactProject,
    next: mockNextProject,
  };

  if (showWorkspace) {
    return (
      <ProjectWorkspace
        result={projects[selectedProject]}
        onBack={() => setShowWorkspace(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="bg-white rounded-2xl shadow-2xl p-12">
          <h1 className="text-4xl font-bold mb-2 font-serif italic">Sandbox Testing</h1>
          <p className="text-slate-600 mb-8">Test the ProjectWorkspace component with different project types</p>

          <div className="space-y-6">
            {/* Project Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Select Project Type:</label>
              <div className="grid grid-cols-3 gap-4">
                {/* HTML Project */}
                <button
                  onClick={() => setSelectedProject('html')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProject === 'html'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-lg">📄 HTML</div>
                  <div className="text-sm text-slate-600">Vanilla JS + CSS</div>
                </button>

                {/* React Project */}
                <button
                  onClick={() => setSelectedProject('react')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProject === 'react'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-lg">⚛️ React</div>
                  <div className="text-sm text-slate-600">with Tailwind</div>
                </button>

                {/* Next.js Project */}
                <button
                  onClick={() => setSelectedProject('next')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProject === 'next'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-lg">▲ Next.js</div>
                  <div className="text-sm text-slate-600">Framework</div>
                </button>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Project Details:</h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p><strong>Type:</strong> {selectedProject.toUpperCase()}</p>
                <p><strong>Files:</strong> {projects[selectedProject].files.length} files</p>
                <p><strong>File list:</strong> {projects[selectedProject].files.map(f => f.path).join(', ')}</p>
              </div>
            </div>

            {/* Test Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Select a project type above</li>
                <li>Click "View ProjectWorkspace" button below</li>
                <li>Test the "Code" tab to view files</li>
                <li>Test the "Live" tab to see the sandbox rendering</li>
                <li>Use browser DevTools (F12) → Console to see debug logs</li>
              </ul>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setShowWorkspace(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              View ProjectWorkspace →
            </button>
          </div>

          {/* Usage Info */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">How to use:</h3>
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 space-y-2 font-mono">
              <p>1. Navigate to: <code className="bg-slate-200 px-2 py-1 rounded">/test</code></p>
              <p>2. Or import directly:</p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto">
{`import SandboxTester from './test/SandboxTester';

// Then use:
<SandboxTester />`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
