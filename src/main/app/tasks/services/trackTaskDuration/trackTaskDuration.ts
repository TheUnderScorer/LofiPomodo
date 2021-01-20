import { AppContext } from '../../../../context';
import { PomodoroService } from '../../../pomodoro/services/pomodoroService/PomodoroService';

export const trackTaskDuration = ({
  pomodoro,
  taskRepository,
}: Pick<AppContext, 'pomodoro' | 'taskRepository'>) => {
  pomodoro.events.onAny(async (eventName) => {
    if (!PomodoroService.breakEventsMap.includes(eventName)) {
      return;
    }

    const activeTask = await taskRepository.getActiveTask();

    if (!activeTask) {
      return;
    }

    if (!activeTask.pomodoroSpent) {
      activeTask.pomodoroSpent = [];
    }

    activeTask.pomodoroSpent!.push({
      finishedAt: new Date().toISOString(),
      durationInSeconds: pomodoro.workDurationSeconds,
    });

    await taskRepository.update(activeTask);
  });
};
