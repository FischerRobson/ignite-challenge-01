export interface Task {
  id: string;
  title: string;
  description: string;
  completed_at: null | Date;
  created_at: Date;
  updated_at: null | Date;
}