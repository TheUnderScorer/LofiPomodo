import { BaseModel, Order, Pagination } from './database';
import { TaskSynchronizer } from '../../main/app/tasks/services/TaskSynchronizer';

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
    'id' | 'createdAt' | 'updatedAt' | 'state' | 'pomodoroSpent' | 'source'
  > {
  source?: TaskSource;
}

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
  SyncWithApis = 'SyncWithApis',
  IsSyncingWithApis = 'IsSyncingWithApis',
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
  Trello = 'Trello',
  Local = 'Local',
}

export enum TaskState {
  Todo = 'Todo',
  Completed = 'Completed',
}

export type TasksByState = Record<TaskState, Task[]>;
export type CountTasksByState = Record<TaskState, number>;

export type IsSyncingWithApisResult = Pick<TaskSynchronizerJson, 'isSyncing'>;

export interface TaskSynchronizerJson {
  isSyncing: boolean;
  lastSyncDate?: string;
  lastError?: {
    message: string;
    name: string;
  };
}

export enum TaskSynchronizerEvents {
  SyncStarted = 'SyncStarted',
  SyncEnded = 'SyncEnded',
  SyncFailed = 'SyncFailed',
}

export interface TaskSynchronizerFailedPayload {
  error: Error;
  service: TaskSynchronizer;
}

export interface TaskSynchronizerEventsPayloadMap {
  [TaskSynchronizerEvents.SyncStarted]: TaskSynchronizer;
  [TaskSynchronizerEvents.SyncEnded]: TaskSynchronizer;
  [TaskSynchronizerEvents.SyncFailed]: TaskSynchronizerFailedPayload;
}
