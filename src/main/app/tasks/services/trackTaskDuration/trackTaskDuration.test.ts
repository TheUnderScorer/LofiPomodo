import ElectronStore from 'electron-store';
import { createMockProxy } from 'jest-mock-proxy';
import { AppStore } from '../../../../../shared/types/store';
import { wait } from '../../../../../shared/utils/timeout';
import { createMockTask } from '../../../../../tests/mocks/tasks';
import { PomodoroService } from '../../../pomodoro/services/pomodoroService/PomodoroService';
import { TaskRepository } from '../../repositories/TaskRepository';
import { trackTaskDuration } from './trackTaskDuration';
import { Task } from '../../../../../shared/types/tasks';
import { PomodoroState, Trigger } from '../../../../../shared/types';

describe('Track task duration', () => {
  const taskRepository = createMockProxy<TaskRepository>();
  const pomodoroService = new PomodoroService(
    createMockProxy<ElectronStore<AppStore>>()
  );

  beforeEach(async () => {
    taskRepository.mockClear();
  });

  it('should not track duration on work', async () => {
    const now = new Date();
    const iso = now.toISOString();

    jest.spyOn(Date.prototype, 'toISOString').mockImplementation(() => iso);

    const task: Task = {
      ...createMockTask(),
      active: true,
    };

    taskRepository.getActiveTask.mockResolvedValue(task);

    const unsub = trackTaskDuration({
      pomodoro: pomodoroService,
      taskRepository,
    });

    await pomodoroService.stateChanged$.next({
      newState: PomodoroState.Work,
      oldState: PomodoroState.LongBreak,
      pomodoro: pomodoroService,
      trigger: Trigger.Scheduled,
    });

    await wait(100);

    expect(taskRepository.update).toHaveBeenCalledTimes(0);

    unsub();
  });

  it('should track task duration on break change', async () => {
    const now = new Date();
    const iso = now.toISOString();

    jest.spyOn(Date.prototype, 'toISOString').mockImplementation(() => iso);

    const task: Task = {
      ...createMockTask(),
      active: true,
    };

    taskRepository.getActiveTask.mockResolvedValue(task);

    trackTaskDuration({
      pomodoro: pomodoroService,
      taskRepository,
    });

    await pomodoroService.stateChanged$.next({
      newState: PomodoroState.Break,
      oldState: PomodoroState.LongBreak,
      pomodoro: pomodoroService,
      trigger: Trigger.Scheduled,
    });

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
  });
});
