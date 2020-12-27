import { Task } from './tasks';

export enum TaskProviderType {
  Trello = 'Trello',
}

export interface TaskProvider {
  fetchTasks(): Promise<Task[]>;
}

export interface TrelloSettings {
  boardIds?: string[];
  // Dictionary with boardId as a key, and array of related list ids from which tasks should be synced
  listIds?: Record<string, string[]>;
  userToken?: string;
}
