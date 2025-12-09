import React from 'react';
import { Clock, MoreHorizontal, ChevronRight, ChevronLeft, Flame } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onMove: (taskId: string, direction: 'next' | 'prev') => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onMove }) => {
  
  // Color coding based on hours estimate (mock complexity)
  const hoursColor = task.hoursEstimate > 10 ? 'text-orange-400' : 'text-slate-400';
  const isHighPriority = task.priority === 'high';

  return (
    <div className={`group bg-slate-800 hover:bg-slate-700 border ${isHighPriority ? 'border-red-500/30' : 'border-slate-700'} hover:border-slate-500 hover:-translate-y-1 hover:shadow-xl rounded-lg p-4 shadow-sm transition-all duration-300 ease-out mb-3 relative`}>
      
      {isHighPriority && (
        <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
            <Flame size={10} />
            High Priority
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-200 text-sm leading-snug pr-6">
          {task.title}
        </h4>
        <button className="text-slate-500 hover:text-slate-300 transition-colors">
            <MoreHorizontal size={16} />
        </button>
      </div>

      <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className={`flex items-center gap-1.5 text-xs font-medium ${hoursColor} bg-slate-900/50 px-2 py-1 rounded`}>
          <Clock size={12} />
          <span>{task.hoursEstimate}h</span>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {task.status !== 'todo' && (
                <button 
                    onClick={() => onMove(task.id, 'prev')}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                    title="Move Back"
                >
                    <ChevronLeft size={16} />
                </button>
            )}
            {task.status !== 'done' && (
                <button 
                    onClick={() => onMove(task.id, 'next')}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                    title="Move Forward"
                >
                    <ChevronRight size={16} />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;