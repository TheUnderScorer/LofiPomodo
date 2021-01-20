import { Task, TaskState } from '../../../../shared/types/tasks';

export const filterByChangedState = (
  newTasks: Task[],
  oldTasks: Task[],
  state: TaskState
) => {
  return newTasks.filter((task) => {
    const prevTask = oldTasks.find(({ id }) => task.id === id);

    return prevTask?.state !== state && task.state === state;
  });
};
