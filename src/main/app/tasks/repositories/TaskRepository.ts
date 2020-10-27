import { Repository } from '../../../shared/database/Repository';
import { GetTasksPayload, Task } from '../../../../shared/types/tasks';
import { applyOrder } from '../../../shared/database/queryHelpers/applyOrder';
import { applyPagination } from '../../../shared/database/queryHelpers/applyPagination';

export class TaskRepository extends Repository<Task> {
  async listTasks({ order, source, pagination }: GetTasksPayload = {}) {
    const query = this.getQueryBuilder();

    if (order) {
      applyOrder(query, order);
    }

    if (source) {
      query.where('source', source);
    }

    if (pagination) {
      applyPagination(query, pagination);
    }

    return query;
  }
}
