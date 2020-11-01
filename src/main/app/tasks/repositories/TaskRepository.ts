import { Repository } from '../../../shared/database/Repository';
import { GetTasksPayload, Task } from '../../../../shared/types/tasks';
import { applyOrder } from '../../../shared/database/queryHelpers/applyOrder';
import { applyPagination } from '../../../shared/database/queryHelpers/applyPagination';
import { OrderDirection } from '../../../../shared/types/database';

export class TaskRepository extends Repository<Task> {
  async listTasks({
    order,
    source,
    pagination,
    completed,
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
}
