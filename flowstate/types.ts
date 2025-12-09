export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'normal' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  hoursEstimate: number;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface OKRData {
  objective: string;
  keyResults: string[];
}

export interface ProjectData {
  okrs: OKRData;
  tasks: Task[];
}

export interface AppState {
  view: 'upload' | 'analyzing' | 'dashboard' | 'error';
  data: ProjectData | null;
  error?: string;
}