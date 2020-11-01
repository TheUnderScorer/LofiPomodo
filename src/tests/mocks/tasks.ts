import { Task, TaskSource, TaskState } from '../../shared/types/tasks';
import { v4 as uuid } from 'uuid';

export const createMockTask = (): Task => ({
  id: uuid(),
  description: 'Lorem ipsum',
  source: TaskSource.Local,
  state: TaskState.Todo,
  title: 'Test',
});
