import {
  CreateTaskInput,
  Task,
  TaskSource,
  TaskState,
} from '../../../../shared/types/tasks';
import { v4 as uuid } from 'uuid';
import { TaskRepository } from '../repositories/TaskRepository';
import { Typed as EventEmitter } from 'emittery';

export enum TasksServiceEvents {
  Created = 'TaskCreated',
}

export interface TasksServiceEventsMap {
  [TasksServiceEvents.Created]: Task;
}

export class TasksService {
  public readonly events = new EventEmitter<TasksServiceEventsMap>();

  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(input: CreateTaskInput) {
    const task: Task = {
      id: uuid(),
      source: TaskSource.Local,
      state: TaskState.Todo,
      ...input,
    };

    await this.taskRepository.insert(task);
    await this.events.emit(TasksServiceEvents.Created, task);

    return task;
  }
}
