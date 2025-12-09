import React from 'react';
import { ProjectData, TaskStatus } from '../types';
import OKRDisplay from './OKRDisplay';
import KanbanBoard from './KanbanBoard';
import { LayoutDashboard, LogOut, DollarSign, Briefcase } from 'lucide-react';

interface DashboardProps {
  data: ProjectData;
  onReset: () => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onReset, updateTaskStatus }) => {
  
  const handleMoveTask = (taskId: string, direction: 'next' | 'prev') => {
    const task = data.tasks.find(t => t.id === taskId);
    if (!task) return;

    const statusOrder: TaskStatus[] = ['todo', 'in-progress', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    // Boundary checks
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= statusOrder.length) newIndex = statusOrder.length - 1;

    if (newIndex !== currentIndex) {
      updateTaskStatus(taskId, statusOrder[newIndex]);
    }
  };

  // Cost Calculation
  const totalHours = data.tasks.reduce((acc, task) => acc + task.hoursEstimate, 0);
  const hourlyRate = 150;
  const totalCost = totalHours * hourlyRate;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      {/* Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">FlowState</span>
          </div>
          <button 
            onClick={onReset}
            className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800"
          >
            <LogOut size={16} />
            Start Over
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <OKRDisplay data={data.okrs} />
        
        <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-400"/>
                    Project Board
                </h2>
                <div className="text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-slate-400">
                    Total Effort: <span className="text-slate-200 font-mono font-medium">{totalHours}h</span>
                </div>
            </div>
            <KanbanBoard tasks={data.tasks} onMoveTask={handleMoveTask} />
        </div>
      </main>

      {/* Financial Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800/80 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] z-40 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Estimated Budget</span>
                <span className="text-xs text-slate-600">Based on {totalHours} hours @ ${hourlyRate}/hr</span>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-400 font-mono flex items-center tracking-tight">
                        <span className="text-lg text-emerald-500/60 mr-1">$</span>
                        {totalCost.toLocaleString()}
                    </div>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-full">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;