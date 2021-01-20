import {
  CreateTaskInput,
  Task,
  TaskSource,
  TaskState,
} from '../../../../shared/types/tasks';
import { v4 as uuid } from 'uuid';
import { TaskRepository } from '../repositories/TaskRepository';
import { Typed as EventEmitter } from 'emittery';
import { mapToId } from '../../../../shared/mappers/mapToId';
import { filterByChangedState } from '../arrayFilters/filterByChangedState';

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

  async createTask<ProviderMeta = any>({
    source,
    ...input
  }: CreateTaskInput<ProviderMeta>) {
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
      await repository.flagActiveTask();

      return task;
    });
  }

  async updateTasks(tasks: Task[]) {
    const prevTasks = await this.taskRepository.getMany(mapToId(tasks));

    const mappedTasks = tasks.map((task) => ({
      ...task,
      index: task.state === TaskState.Completed ? 0 : task.index,
    }));

    const completedTasks = filterByChangedState(
      mappedTasks,
      prevTasks,
      TaskState.Completed
    );

    const unCompletedTask = filterByChangedState(
      mappedTasks,
      prevTasks,
      TaskState.Todo
    );

    const updateResult = await this.taskRepository.transaction(
      async (repository) => {
        const result = await repository.updateMany(mappedTasks, prevTasks);

        await repository.flagActiveTask();

        return result;
      }
    );

    Promise.all(
      completedTasks.map((task) =>
        this.events.emit(TaskCrudEvents.Completed, task)
      )
    ).catch(console.error);

    Promise.all([
      unCompletedTask.map((task) =>
        this.events.emit(TaskCrudEvents.UnCompleted, task)
      ),
    ]).catch(console.error);

    return updateResult;
  }

  async deleteTasks(ids: string[]) {
    await this.taskRepository.transaction(async (repository) => {
      await repository.delete(ids);
      await repository.flagActiveTask();
    });
  }
}
