import ElectronStore from 'electron-store';
import { createMockProxy } from 'jest-mock-proxy';
import { AppStore } from '../../../../../shared/types/store';
import { wait } from '../../../../../shared/utils/timeout';
import { createMockTask } from '../../../../../tests/mocks/tasks';
import {
  PomodoroService,
  PomodoroServiceEvents,
  Trigger,
} from '../../../pomodoro/services/pomodoroService/PomodoroService';
import { TaskRepository } from '../../repositories/TaskRepository';
import { trackTaskDuration } from './trackTaskDuration';
import { Task } from '../../../../../shared/types/tasks';

describe('Track task duration', () => {
  const taskRepository = createMockProxy<TaskRepository>();
  const pomodoroService = new PomodoroService(
    createMockProxy<ElectronStore<AppStore>>()
  );

  beforeEach(async () => {
    taskRepository.mockClear();
  });

  it('should track task duration', () => {
    const now = new Date();
    const iso = now.toISOString();

    jest.spyOn(Date.prototype, 'toISOString').mockImplementation(() => iso);

    return new Promise<void>(async (resolve) => {
      const task: Task = {
        ...createMockTask(),
        active: true,
      };

      taskRepository.getActiveTask.mockResolvedValue(task);

      pomodoroService.events.on(
        PomodoroServiceEvents.BreakStarted,
        async () => {
          await wait(100);

          expect(taskRepository.update).toHaveBeenCalledTimes(1);
          expect(taskRepository.update).toHaveBeenCalledWith({
            ...task,
            pomodoroSpent: [
              {
                durationInSeconds: pomodoroService.workDurationSeconds,
                finishedAt: iso,
              },
            ],
          } as Task);

          resolve();
        }
      );

      trackTaskDuration({
        pomodoro: pomodoroService,
        taskRepository,
      });

      await pomodoroService.events.emit(PomodoroServiceEvents.BreakStarted, {
        pomodoro: pomodoroService,
        trigger: Trigger.Scheduled,
      });
    });
  });
});
