import { Repository } from '../../../shared/database/Repository';
import {
  CountTasksByState,
  GetTasksPayload,
  Task,
  TaskSource,
  TaskState,
} from '../../../../shared/types/tasks';
import { applyOrder } from '../../../shared/database/queryHelpers/applyOrder';
import { applyPagination } from '../../../shared/database/queryHelpers/applyPagination';
import { OrderDirection } from '../../../../shared/types/database';
import { groupTasksByState } from '../../../../shared/app/tasks/groupTasksByState';
import { act } from 'react-dom/test-utils';

export interface TaskDb extends Omit<Task, 'pomodoroSpent'> {
  pomodoroSpent?: string;
}

export class TaskRepository extends Repository<TaskDb, Task> {
  async listTasks({
    order,
    source,
    pagination,
    completed,
    state,
  }: GetTasksPayload = {}): Promise<Task[]> {
    const query = this.getQueryBuilder();

    if (order) {
      applyOrder(query, order);
    } else {
      query.orderBy('index', OrderDirection.Asc);
    }

    if (source) {
      query.where('source', source);
    }

    if (state) {
      query.where('state', state);
    }

    if (pagination) {
      applyPagination(query, pagination);
    }

    if (typeof completed === 'boolean') {
      query.where('completed', completed);
    }

    const items = (await query) as TaskDb[];

    return items.map((task) => this.fromDb(task));
  }

  async incrementTodoIndexes() {
    return this.getQueryBuilder()
      .where('state', TaskState.Todo)
      .increment('index', 1);
  }

  async getActiveTask(): Promise<Task | null> {
    const task = await this.getQueryBuilder()
      .select()
      .orderBy('index', OrderDirection.Asc)
      .where('state', TaskState.Todo)
      .first<TaskDb | null>();

    return task ? this.fromDb(task) : null;
  }

  async flagActiveTask() {
    const activeTaskByOrder = await this.getActiveTask();
    const flaggedTasks = await this.getQueryBuilder().where<TaskDb[]>(
      'active',
      true
    );

    if (activeTaskByOrder) {
      if (flaggedTasks) {
        await Promise.all(
          flaggedTasks.map((task) => {
            task.active = false;

            return this.update(this.fromDb(task));
          })
        );
      }

      activeTaskByOrder.active = true;

      await this.update(activeTaskByOrder);
    }
  }

  async getAllGroupedByState() {
    const tasks = await this.getQueryBuilder().select<TaskDb[]>();

    return groupTasksByState(tasks.map((task) => this.fromDb(task)));
  }

  async getLastIndex(): Promise<number | null> {
    const task = await this.getQueryBuilder()
      .select(['index'])
      .orderBy('index', OrderDirection.Desc)
      .first<Task | null>();

    return task?.index ?? null;
  }

  async getWithLargestIndex(index: number): Promise<Task[]> {
    return this.getQueryBuilder().select().where('index', '>', index);
  }

  async countGroupedByState() {
    const states = Object.values(TaskState);

    const counts = await Promise.all(
      states.map((state) =>
        this.getQueryBuilder()
          .where('state', state)
          .count({
            total: '*',
          })
          .first()
      )
    );

    return counts.reduce<CountTasksByState>(
      (acc, val, index) => {
        const state = states[index];

        acc[state] = val.total;

        return acc;
      },
      {
        [TaskState.Completed]: 0,
        [TaskState.Todo]: 0,
      }
    );
  }

  /**
   * Ensures that tasks indexes are always in correct order
   * */
  async ensureIndexes() {
    const todoTasks = await this.listTasks({
      state: TaskState.Todo,
    });

    const mappedTasks = await todoTasks.map((task, index) => ({
      ...task,
      index,
    }));

    await this.updateMany(mappedTasks);
  }

  async getBySource(source: TaskSource) {
    const result = await this.getQueryBuilder()
      .select<TaskDb[]>()
      .where('source', source);

    return result.map((item) => this.fromDb(item));
  }

  async getBySourceIds(source: TaskSource, ids: string[]) {
    const result = await this.getQueryBuilder()
      .select<TaskDb[]>()
      .where('source', source)
      .andWhere('sourceId', 'IN', ids);

    return result.map((item) => this.fromDb(item));
  }

  async deleteCompletedTasks() {
    return this.getQueryBuilder().where('state', TaskState.Completed).delete();
  }

  protected fromDb(entity: TaskDb): Task {
    return {
      ...entity,
      pomodoroSpent: entity.pomodoroSpent
        ? JSON.parse(entity.pomodoroSpent)
        : undefined,
    };
  }

  protected toDb(entity: Task): TaskDb {
    return {
      ...entity,
      pomodoroSpent: entity.pomodoroSpent
        ? JSON.stringify(entity.pomodoroSpent)
        : undefined,
    };
  }
}
