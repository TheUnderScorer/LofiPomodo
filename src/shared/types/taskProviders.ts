import { Task } from './tasks';

export enum TaskProviderType {
  Trello = 'Trello',
}

export interface TaskProvider {
  fetchTasks(): Promise<Task[]>;
}
