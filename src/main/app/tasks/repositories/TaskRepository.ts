import { Repository } from '../../../shared/database/Repository';
import {
  CountTasksByState,
  GetTasksPayload,
  Task,
  TaskState,
} from '../../../../shared/types/tasks';
import { applyOrder } from '../../../shared/database/queryHelpers/applyOrder';
import { applyPagination } from '../../../shared/database/queryHelpers/applyPagination';
import { OrderDirection } from '../../../../shared/types/database';
import { groupTasksByState } from '../../../../shared/app/tasks/groupTasksByState';

export class TaskRepository extends Repository<Task> {
  async listTasks({
    order,
    source,
    pagination,
    completed,
    state,
  }: GetTasksPayload = {}) {
    const query = this.getQueryBuilder();

    if (order) {
      applyOrder(query, order);
    } else {
      query.orderBy('createdAt', OrderDirection.Desc);
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

    return query;
  }

  async getActiveTask() {
    return this.getQueryBuilder().where('active', true).first<Task | null>();
  }

  async setActiveTask(id: string) {
    await this.getQueryBuilder().where('id', id).update<Task>({
      active: true,
    });
  }

  async markActiveTaskAsNotActive() {
    await this.getQueryBuilder().where('active', true).update<Task>({
      active: false,
    });
  }

  async getAllGroupedByState() {
    const tasks = await this.getQueryBuilder().select<Task[]>();

    return groupTasksByState(tasks);
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
}
