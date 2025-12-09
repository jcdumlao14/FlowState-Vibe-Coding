import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-200 animate-in fade-in duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
      </div>
      <h2 className="mt-8 text-2xl font-semibold tracking-tight text-white">Analying Strategy...</h2>
      <p className="mt-2 text-slate-400 text-sm max-w-md text-center">
        Our AI is reading your whiteboard, extracting OKRs, and estimating resources for your workflow.
      </p>
      
      <div className="mt-8 flex gap-3 text-xs font-mono text-slate-500 uppercase tracking-widest">
        <span className="flex items-center gap-1"><Sparkles size={12}/> Vision</span>
        <span className="w-1 h-1 rounded-full bg-slate-700 self-center"></span>
        <span className="flex items-center gap-1">Extraction</span>
        <span className="w-1 h-1 rounded-full bg-slate-700 self-center"></span>
        <span className="flex items-center gap-1">Planning</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
