import React, { useState, useEffect, useRef } from 'react';
import { GenerationResult, GeneratedFile } from '../types';
import { File, Download, ChevronLeft, Code, Eye, FolderTree, Copy, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { Highlight, themes } from 'prism-react-renderer';
import { WebContainer } from '@webcontainer/api';

let webcontainerPromise: Promise<WebContainer> | null = null;

interface ProjectWorkspaceProps {
  result: GenerationResult;
  onBack: () => void;
  onLogout?: () => void;
}

export default function ProjectWorkspace({ result, onBack, onLogout }: ProjectWorkspaceProps) {
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(result.files[0] || null);
  const [viewMode, setViewMode] = useState<'code' | 'live'>('code');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const sandboxRef = useRef<HTMLDivElement>(null);

  const detectProjectType = () => {
    const files = result.files.map(f => f.path);
    const hasPackageJson = files.includes('package.json');
    const hasIndexHtml = files.includes('index.html');
    
    if (hasPackageJson) return 'webcontainer';
    if (hasIndexHtml) return 'html';
    return 'html';
  };

  const assembleHtmlProject = (): string => {
    const htmlFile = result.files.find(f => f.path === 'index.html');
    if (!htmlFile) return '<h1 style="color:white; padding:20px;">No index.html found in generated files</h1>';

    let html = htmlFile.content;
    result.files.forEach(file => {
      if (file.path.endsWith('.css') && !html.includes(file.content)) {
        html = html.replace('</head>', `<style>\n${file.content}\n</style>\n</head>`);
      }
      if (file.path.endsWith('.js') && !file.path.includes('node_modules') && !html.includes(file.content)) {
        html = html.replace('</body>', `<script>\n${file.content}\n</script>\n</body>`);
      }
    });
    return html;
  };

  useEffect(() => {
    console.log('🔄 Effect triggered. ViewMode:', viewMode);

    if (viewMode !== 'live') return;

    const projectType = detectProjectType();
    console.log('📂 Detected Project Type:', projectType);

    if (projectType === 'html') {
      console.log('🌐 Rendering as simple HTML iframe');
      return;
    }

    const initializeWebContainer = async () => {
      console.log('🚀 initializeWebContainer starting...');
      setSandboxLoading(true);

      let waitAttempts = 0;
      while (!sandboxRef.current && waitAttempts < 20) {
        await new Promise(r => setTimeout(r, 100));
        waitAttempts++;
      }

      if (!sandboxRef.current) {
        console.error('❌ sandboxRef.current never became available');
        return;
      }

      try {
        sandboxRef.current.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:white;background:#0f172a;font-family:sans-serif;gap:16px;">
            <div style="width:32px;height:32px;border:3px solid rgba(255,255,255,0.1);border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite;"></div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
            <div id="status-msg">Booting WebContainer...</div>
          </div>
        `;

        const updateStatus = (msg: string) => {
          console.log(`📡 Status: ${msg}`);
          const el = document.getElementById('status-msg');
          if (el) el.innerText = msg;
        };

        if (!webcontainerPromise) {
          console.log('⚡ Calling WebContainer.boot()...');
          webcontainerPromise = WebContainer.boot();
        }
        const webcontainer = await webcontainerPromise;
        console.log('✅ WebContainer booted successfully');

        updateStatus('Mounting files...');
        const fileSystemTree: any = {};
        result.files.forEach(file => {
          const pathParts = file.path.split('/');
          let current = fileSystemTree;
          for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            if (!current[part]) current[part] = { directory: {} };
            current = current[part].directory;
          }
          current[pathParts[pathParts.length - 1]] = { file: { contents: file.content } };
        });

        await webcontainer.mount(fileSystemTree);
        console.log('✅ Files mounted into virtual FS');

        updateStatus('Installing dependencies (this may take a minute)...');
        const installProcess = await webcontainer.spawn('npm', ['install']);
        
        installProcess.output.pipeTo(new WritableStream({
          write(data) { console.log('📦 npm:', data); }
        }));

        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) throw new Error('npm install failed');
        console.log('✅ Dependencies installed');

        updateStatus('Starting server...');
        
        webcontainer.on('server-ready', (port, url) => {
          console.log(`🎉 Server ready at ${url} (Port ${port})`);
          if (sandboxRef.current) {
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.background = 'white';
            
            sandboxRef.current.innerHTML = '';
            sandboxRef.current.appendChild(iframe);
            setSandboxLoading(false);
          }
        });

        const startArgs = result.files.some(f => f.path.includes('vite')) ? ['run', 'dev'] : ['start'];
        console.log(`🏃 Executing: npm ${startArgs.join(' ')}`);
        const serverProcess = await webcontainer.spawn('npm', startArgs);

        serverProcess.output.pipeTo(new WritableStream({
          write(data) { console.log('🔧 server output:', data); }
        }));

      } catch (err) {
        console.error('❌ FATAL ERROR:', err);
        setSandboxLoading(false);
        if (sandboxRef.current) {
          sandboxRef.current.innerHTML = `<div style="color:white; background:#7f1d1d; padding:20px;">
            <h3>Failed to start live preview</h3>
            <p>${err instanceof Error ? err.message : 'Unknown Error'}</p>
          </div>`;
        }
      }
    };

    initializeWebContainer();
  }, [viewMode, result.files]);

  const handleDownload = async () => {
    const zip = new JSZip();
    result.files.forEach(file => zip.file(file.path, file.content));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-export.zip';
    a.click();
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-slate-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-lg"><ChevronLeft size={20} /></button>
          <h2 className="font-bold text-lg font-serif italic">Generated Project</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setViewMode('code')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'code' ? 'bg-slate-900 text-white' : 'hover:bg-slate-200'}`}><Code size={16} />Code</button>
          <button onClick={() => setViewMode('live')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'live' ? 'bg-slate-900 text-white' : 'hover:bg-slate-200'}`}><Eye size={16} />Live</button>
          <div className="w-px h-6 bg-slate-300 mx-2" />
          <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"><Download size={16} />Download ZIP</button>
          {onLogout && <button onClick={onLogout} className="ml-4 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-400 transition-colors">Logout</button>}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r bg-slate-50 overflow-y-auto p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-4 px-2">
            <FolderTree size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Project Files</span>
          </div>
          <div className="space-y-1">
            {result.files.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${selectedFile?.path === file.path ? 'bg-white shadow-sm border border-slate-200 font-medium text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                <File size={16} className={selectedFile?.path === file.path ? 'text-blue-500' : 'text-slate-400'} />
                <span className="truncate">{file.path}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex-1 overflow-hidden relative bg-slate-900">
          <AnimatePresence mode="wait">
            {viewMode === 'code' ? (
              <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full overflow-auto bg-slate-950 p-8">
                <div className="flex items-start justify-center min-h-full">
                  {selectedFile ? (
                    <div className="w-full max-w-4xl">
                      <Highlight theme={themes.nightOwl} code={selectedFile.content} language={selectedFile.path.split('.').pop() || 'tsx'}>
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                          <div className="rounded-xl shadow-2xl overflow-hidden border border-slate-800">
                            <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                              <span className="text-xs text-slate-400">{selectedFile.path}</span>
                              <button onClick={() => { navigator.clipboard.writeText(selectedFile.content); setCopiedFile(selectedFile.path); setTimeout(() => setCopiedFile(null), 2000); }} className="text-xs text-slate-400 hover:text-slate-200">
                                {copiedFile === selectedFile.path ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            </div>
                            <pre style={style} className={`${className} p-4 overflow-auto text-sm max-h-[80vh]`}>
                              {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                  <span className="text-slate-600 mr-4 select-none w-8 inline-block text-right">{i + 1}</span>
                                  {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                                </div>
                              ))}
                            </pre>
                          </div>
                        )}
                      </Highlight>
                    </div>
                  ) : <div className="text-slate-500 italic">No file selected</div>}
                </div>
              </motion.div>
            ) : (
              <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
                {detectProjectType() === 'html' ? (
                  <iframe srcDoc={assembleHtmlProject()} className="w-full h-full border-none bg-white" title="Preview" />
                ) : (
                  <div ref={sandboxRef} className="w-full h-full bg-slate-900" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}