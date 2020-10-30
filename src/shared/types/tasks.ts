import { BaseModel, Order, Pagination } from './database';

export interface Task extends BaseModel {
  title: string;
  description: string;
  source: TaskSource;
  sourceId?: string;
  state: TaskState;
  estimatedPomodoroDuration?: number;
  pomodoroSpent?: number;
  completed?: boolean;
  active?: boolean;
}

export interface CreateTaskInput
  extends Omit<
    Task,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'source'
    | 'sourceId'
    | 'state'
    | 'pomodoroSpent'
  > {}

export enum TaskEvents {
  GetTasks = 'GetTasks',
  CreateTask = 'CreateTask',
  GetActiveTask = 'GetActiveTask',
  SetActiveTask = 'SetActiveTask',
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

export enum TaskState {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Completed = 'Completed',
}
