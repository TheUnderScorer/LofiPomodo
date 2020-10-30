import { Task } from '../../../shared/types/tasks';

export const getTaskDurationText = (task: Task) => {
  if (!task.estimatedPomodoroDuration) {
    return '';
  }

  return `${task.pomodoroSpent ?? 0}/${task.estimatedPomodoroDuration}`;
};
