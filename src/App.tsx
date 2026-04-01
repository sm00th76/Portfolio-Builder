import { useState, useEffect } from 'react';
import ResumeForm from './components/ResumeForm';
import ProjectWorkspace from './components/ProjectWorkspace';
import LoginSignup from './components/LoginSignup';
import { PortfolioConfig, GenerationResult } from './types';
import { generatePortfolio } from './services/gemini';
import { authService } from './services/auth';
import { motion, AnimatePresence } from 'motion/react';
import SandboxTester from './test/SandboxTester';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [testMode, setTestMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          await authService.getCurrentUser();
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('Auth check failed, logging out');
        authService.logout();
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('test') === 'sandbox') {
      setTestMode(true);
    }
  }, []);

  const loadingMessages = [
    "Analyzing your professional background...",
    "Architecting the project structure...",
    "Designing the visual interface...",
    "Writing clean, responsive code...",
    "Polishing the final details...",
    "Almost there! Finalizing the assets..."
  ];

  const handleGenerate = async (config: PortfolioConfig) => {
    setIsLoading(true);
    setLoadingStep(0);
    
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 3000);

    try {
      const generationResult = await generatePortfolio(config);
      setResult(generationResult);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Something went wrong during generation. Please try again.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  if (testMode) {
    return <SandboxTester />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginSignup 
        onSuccess={() => setIsAuthenticated(true)} 
      />
    );
  }

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!result && (
        <div className="fixed top-4 right-4 z-40">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12"
          >
            {isLoading ? (
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-serif italic text-slate-700"
                >
                  {loadingMessages[loadingStep]}
                </motion.p>
                <p className="mt-4 text-slate-400 text-sm animate-pulse">This usually takes about 20-30 seconds</p>
              </div>
            ) : null}
            <ResumeForm onGenerate={handleGenerate} isLoading={isLoading} />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="h-screen"
          >
            <ProjectWorkspace 
              result={result}
              onBack={() => setResult(null)}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
