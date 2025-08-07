export enum ActivityStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  status: ActivityStatus;
  createdAt: string;
  totalTimeSpent: number;
  isTiming: boolean;
  lastStartTime: number | null;
}

export type ActivityFormData = Pick<Activity, 'name' | 'description' | 'status'> & { id?: string };

export type ViewMode = 'card' | 'list';
