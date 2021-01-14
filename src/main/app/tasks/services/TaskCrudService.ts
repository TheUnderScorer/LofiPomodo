import {
  CreateTaskInput,
  Task,
  TaskSource,
  TaskState,
} from '../../../../shared/types/tasks';
import { v4 as uuid } from 'uuid';
import { TaskRepository } from '../repositories/TaskRepository';
import { Typed as EventEmitter } from 'emittery';

export enum TaskCrudEvents {
  Completed = 'TaskCompleted',
  UnCompleted = 'TaskUnCompleted',
}

export interface TaskCrudEventsMap {
  [TaskCrudEvents.Completed]: Task;
  [TaskCrudEvents.UnCompleted]: Task;
}

export class TaskCrudService {
  public readonly events = new EventEmitter<TaskCrudEventsMap>();

  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask({ source, ...input }: CreateTaskInput) {
    const task: Task = {
      id: uuid(),
      source: source ?? TaskSource.Local,
      state: TaskState.Todo,
      index: 0,
      ...input,
    };

    return this.taskRepository.transaction(async (repository) => {
      await repository.incrementTodoIndexes();
      await repository.insert(task);

      return task;
    });
  }

  async updateTasks(tasks: Task[]) {
    const mappedTasks = tasks.map((task) => ({
      ...task,
      index: task.state === TaskState.Completed ? 0 : task.index,
    }));

    const result = await this.taskRepository.transaction(async (repository) => {
      const result = await repository.updateMany(mappedTasks);

      return result;
    });

    this.taskRepository.ensureIndexes().catch(console.error);

    return result;
  }

  async deleteTasks(ids: string[]) {
    await this.taskRepository.transaction(async (repository) => {
      await repository.delete(ids);
      await repository.ensureIndexes();
    });
  }
}
