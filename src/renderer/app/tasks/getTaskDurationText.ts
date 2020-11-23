import { Task } from '../../../shared/types/tasks';

export const getTaskDurationText = (task: Task) => {
  if (!task.estimatedPomodoroDuration) {
    return task.pomodoroSpent?.length ?? '0';
  }

  return `${task.pomodoroSpent?.length ?? 0}/${task.estimatedPomodoroDuration}`;
};
