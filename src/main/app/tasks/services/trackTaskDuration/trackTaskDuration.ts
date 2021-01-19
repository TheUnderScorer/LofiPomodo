import { AppContext } from '../../../../context';

export const trackTaskDuration = ({
  pomodoro,
  taskRepository,
}: Pick<AppContext, 'pomodoro' | 'taskRepository'>) => {
  const subscription = pomodoro.anyBreakStarted$.subscribe(async () => {
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

  return () => subscription.unsubscribe();
};
