import React from 'react';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import { Circle, CircleDashed, CheckCircle2 } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, direction: 'next' | 'prev') => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onMoveTask }) => {
  const columns: { id: TaskStatus; title: string; icon: React.ReactNode; color: string }[] = [
    { id: 'todo', title: 'To Do', icon: <CircleDashed size={16}/>, color: 'text-slate-400' },
    { id: 'in-progress', title: 'In Progress', icon: <Circle size={16}/>, color: 'text-blue-400' },
    { id: 'done', title: 'Done', icon: <CheckCircle2 size={16}/>, color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        const hoursTotal = colTasks.reduce((acc, t) => acc + t.hoursEstimate, 0);

        return (
          <div key={col.id} className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-800/50">
            {/* Column Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={col.color}>{col.icon}</span>
                <h3 className="font-semibold text-sm text-slate-300 uppercase tracking-wide">
                  {col.title}
                </h3>
                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-600">
                {hoursTotal}h
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-3 overflow-y-auto min-h-[200px]">
              {colTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-slate-800 rounded-lg">
                  <p className="text-sm">No tasks</p>
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onMove={onMoveTask} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
