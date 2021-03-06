import {
  CreateTaskInput,
  Task,
  TaskSource,
  TaskState,
} from '../../../../shared/types/tasks';
import { v4 as uuid } from 'uuid';
import { TaskRepository } from '../repositories/TaskRepository';
import { mapToId } from '../../../../shared/mappers/mapToId';
import { filterByChangedState } from '../arrayFilters/filterByChangedState';
import { Subject } from 'rxjs';

export class TaskCrudService {
  readonly tasksCompleted$ = new Subject<Task[]>();
  readonly tasksUncompleted$ = new Subject<Task[]>();

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

    await this.taskRepository.incrementTodoIndexes();
    await this.taskRepository.insert(task);
    await this.taskRepository.flagActiveTask();

    return task;
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

    const unCompletedTasks = filterByChangedState(
      mappedTasks,
      prevTasks,
      TaskState.Todo
    );

    const updateResult = await this.taskRepository.updateMany(
      mappedTasks,
      prevTasks
    );

    await this.taskRepository.flagActiveTask();

    this.tasksCompleted$.next(completedTasks);
    this.tasksUncompleted$.next(unCompletedTasks);

    return updateResult;
  }

  async deleteTasks(ids: string[]) {
    await this.taskRepository.delete(ids);
    await this.taskRepository.flagActiveTask();
  }
}
