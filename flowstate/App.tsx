import React, { useState, useEffect } from 'react';
import { AppState, ProjectData, TaskStatus } from './types';
import UploadZone from './components/UploadZone';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import { analyzeStrategyImage } from './services/geminiService';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'upload',
    data: null,
  });

  // Handle uploading the image and starting analysis
  const handleImageSelected = async (base64Image: string) => {
    setState(prev => ({ ...prev, view: 'analyzing', error: undefined }));
    
    try {
      const result = await analyzeStrategyImage(base64Image);
      setState({
        view: 'dashboard',
        data: result
      });
    } catch (error) {
      console.error(error);
      setState({
        view: 'error',
        data: null,
        error: "Failed to analyze the image. Please try a clearer image or check your connection."
      });
    }
  };

  // Handle task status updates (moving cards)
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setState(prev => {
        if (!prev.data) return prev;
        
        const updatedTasks = prev.data.tasks.map(t => 
            t.id === taskId ? { ...t, status: newStatus } : t
        );

        return {
            ...prev,
            data: {
                ...prev.data,
                tasks: updatedTasks
            }
        };
    });
  };

  const handleReset = () => {
    setState({ view: 'upload', data: null });
  };

  // Render Logic
  const renderContent = () => {
    switch (state.view) {
      case 'analyzing':
        return <LoadingScreen />;
        
      case 'dashboard':
        if (!state.data) return null; // Should not happen
        return <Dashboard 
                  data={state.data} 
                  onReset={handleReset} 
                  updateTaskStatus={handleUpdateTaskStatus}
                />;
        
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="p-4 bg-red-500/10 rounded-full mb-4">
                <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
            <p className="text-slate-400 max-w-md mb-8">{state.error}</p>
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
                <RefreshCw size={18} />
                Try Again
            </button>
          </div>
        );

      case 'upload':
      default:
        return <UploadZone onImageSelected={handleImageSelected} />;
    }
  };

  // If dashboard, we render full screen without container wrapper constraint
  if (state.view === 'dashboard') {
    return renderContent();
  }

  // Centered layout for Upload/Loading/Error
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="flex-1 flex flex-col z-10">
            {/* Simple Header for non-dashboard views */}
            <div className="w-full py-6 px-8 flex justify-between items-center">
                 <div className="flex items-center gap-2 font-bold text-xl text-white tracking-tight opacity-50">
                    <div className="w-6 h-6 bg-blue-600 rounded-md"></div>
                    FlowState
                 </div>
            </div>

            <main className="flex-1 flex items-center justify-center p-4 pb-20">
                {renderContent()}
            </main>
        </div>
    </div>
  );
};

export default App;
