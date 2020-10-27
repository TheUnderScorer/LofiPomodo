import { BaseModel, Order, Pagination } from './database';

export interface Task extends BaseModel {
  title: string;
  description: string;
  source: TaskSource;
  sourceId?: string;
  estimatedPomodoroDuration?: number;
  completed?: boolean;
}

export enum TaskEvents {
  GetTasks = 'GetTasks',
}

export interface GetTasksPayload {
  source?: TaskSource;
  order?: Order<Task>;
  pagination?: Pagination;
}

export enum TaskSource {
  Jira = 'Jira',
  Local = 'Local',
}
