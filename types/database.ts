export type Task = {
  id: number;
  goal: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  details: string;
  completed: boolean;
  created_at: Date;
}; 