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
      index: 0,
      ...input,
    };

    const result = await this.taskRepository.transaction(async (repository) => {
      await repository.incrementTodoIndexes();
      await repository.insert(task);

      return task;
    });

    await this.events.emit(TasksServiceEvents.Created, result);

    return result;
  }

  async updateTasks(tasks: Task[]) {
    const mappedTasks = tasks.map((task) => ({
      ...task,
      index: task.state === TaskState.Completed ? 0 : task.index,
    }));

    return this.taskRepository.transaction(async (repository) => {
      const result = await repository.updateMany(mappedTasks);

      await repository.ensureIndexes();

      return result;
    });
  }

  async deleteTasks(ids: string[]) {
    await this.taskRepository.transaction(async (repository) => {
      await repository.delete(ids);
      await repository.ensureIndexes();
    });
  }
}
