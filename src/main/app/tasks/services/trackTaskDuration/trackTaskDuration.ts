import { PomodoroService } from '../../../pomodoro/services/pomodoroService/PomodoroService';
import { TaskRepository } from '../../repositories/TaskRepository';
import { SettingsService } from '../../../settings/services/SettingsService';

export interface TrackTaskDurationDependencies {
  pomodoroService: PomodoroService;
  taskRepository: TaskRepository;
  settingsService: SettingsService;
}

export const trackTaskDuration = ({
  pomodoroService,
  taskRepository,
  settingsService,
}: TrackTaskDurationDependencies) => {
  const subscription = pomodoroService.anyBreakStarted$.subscribe(async () => {
    const activeTask = await taskRepository.getActiveTask();

    if (!activeTask) {
      return;
    }

    if (!activeTask.pomodoroSpent) {
      activeTask.pomodoroSpent = [];
    }

    activeTask.pomodoroSpent!.push({
      finishedAt: new Date().toISOString(),
      durationInSeconds: settingsService.pomodoroSettings!.workDurationSeconds,
    });

    await taskRepository.update(activeTask);
  });

  return () => subscription.unsubscribe();
};
