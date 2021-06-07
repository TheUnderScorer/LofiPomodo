import ElectronStore from 'electron-store';
import { createMockProxy } from 'jest-mock-proxy';
import { AppStore } from '../../../../../shared/types/store';
import { wait } from '../../../../../shared/utils/timeout';
import { createMockTask } from '../../../../../tests/mocks/tasks';
import { PomodoroService } from '../../../pomodoro/services/pomodoroService/PomodoroService';
import { TaskRepository } from '../../repositories/TaskRepository';
import { trackTaskDuration } from './trackTaskDuration';
import { Task } from '../../../../../shared/types/tasks';
import { PomodoroStates, Trigger } from '../../../../../shared/types';
import { createMockSettings } from '../../../../../tests/mocks/settings';

describe('Track task duration', () => {
  const mockSettings = createMockSettings();

  const taskRepository = createMockProxy<TaskRepository>();
  const pomodoroService = new PomodoroService(
    createMockProxy<ElectronStore<AppStore>>(),
    mockSettings as any
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
      pomodoroService: pomodoroService,
      taskRepository,
      settingsService: mockSettings as any,
    });

    await pomodoroService.state.stateChanged$.next({
      newState: PomodoroStates.Work,
      oldState: PomodoroStates.LongBreak,
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
      pomodoroService: pomodoroService,
      taskRepository,
      settingsService: mockSettings as any,
    });

    await pomodoroService.state.stateChanged$.next({
      newState: PomodoroStates.Break,
      oldState: PomodoroStates.LongBreak,
      trigger: Trigger.Scheduled,
    });

    await wait(100);

    expect(taskRepository.update).toHaveBeenCalledTimes(1);
    expect(taskRepository.update).toHaveBeenCalledWith({
      ...task,
      pomodoroSpent: [
        {
          durationInSeconds: mockSettings.pomodoroSettings.workDurationSeconds,
          finishedAt: iso,
        },
      ],
    } as Task);
  });
});
