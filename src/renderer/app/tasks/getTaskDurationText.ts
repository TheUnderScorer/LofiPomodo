import { Task } from '../../../shared/types/tasks';

export const getTaskDurationText = (task: Task) => {
  if (!task.estimatedPomodoroDuration) {
    return task.pomodoroSpent?.toString() ?? '0';
  }

  return `${task.pomodoroSpent ?? 0}/${task.estimatedPomodoroDuration}`;
};
