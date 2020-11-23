import { BaseModel, Order, Pagination } from './database';

export interface Task extends BaseModel {
  title: string;
  description: string;
  source: TaskSource;
  sourceId?: string;
  state: TaskState;
  estimatedPomodoroDuration?: number;
  pomodoroSpent?: TaskPomodoroSpent[];
  completed?: boolean;
  active?: boolean;
  index?: number;
}

export interface TaskPomodoroSpent {
  durationInSeconds: number;
  finishedAt: string;
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
  TaskUpdated = 'TaskUpdated',
  TasksDeleted = 'TasksDeleted',
  GetTasksByState = 'GetTasksByState',
  UpdateTask = 'UpdateTask',
  UpdateTasks = 'UpdateTasks',
  CountByState = 'CountByState',
  DeleteTasks = 'DeleteTasks',
  DeleteCompletedTasks = 'DeleteCompletedTasks',
}

export interface GetTasksPayload {
  source?: TaskSource;
  order?: Order<Task>;
  pagination?: Pagination;
  completed?: boolean;
  state?: TaskState;
}

export enum TaskSource {
  Jira = 'Jira',
  Local = 'Local',
}

export enum TaskState {
  Todo = 'Todo',
  Completed = 'Completed',
}

export type TasksByState = Record<TaskState, Task[]>;
export type CountTasksByState = Record<TaskState, number>;
