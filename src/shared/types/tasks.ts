import { BaseModel } from './database';

export interface Task extends BaseModel {
  title: string;
  description: string;
  source: TaskSource;
  sourceId?: string;
  estimatedPomodoroDuration?: number;
  completed?: boolean;
}

export enum TaskSource {
  Jira = 'Jira',
  Local = 'Local',
}
