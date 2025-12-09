import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import { OKRData } from '../types';

interface OKRDisplayProps {
  data: OKRData;
}

const OKRDisplay: React.FC<OKRDisplayProps> = ({ data }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Target className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">Strategic Objective</h2>
          <h3 className="text-2xl font-bold text-white leading-tight">
            {data.objective}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.keyResults.map((kr, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              {kr}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OKRDisplay;
