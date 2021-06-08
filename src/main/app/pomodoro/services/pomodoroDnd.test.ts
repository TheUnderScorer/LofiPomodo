import { createMockProxy } from 'jest-mock-proxy';
import { pomodoroDnd } from './pomodoroDnd';
import { DndService } from '../../../shared/dnd/DndService';
import { Subject } from 'rxjs';
import { wait } from '../../../../shared/utils/timeout';

function createMockPomodoroService() {
  return {
    state: {
      anyBreakStarted$: new Subject(),
      workStarted$: new Subject(),
    },
    anyBreakTimerStart$: new Subject(),
    workTimerStart$: new Subject(),
  };
}

describe('Pomodoro dnd', () => {
  it('should start and stop dnd mode if enabled', async () => {
    const dndService = createMockProxy<DndService>();
    const pomodoroService = createMockPomodoroService();
    const settingsService = {
      pomodoroSettings: {
        dndOnBreak: true,
      },
    };

    pomodoroDnd({
      dndService,
      pomodoroService: pomodoroService as any,
      settingsService: settingsService as any,
    });

    dndService.isEnabled.mockResolvedValue(false);

    pomodoroService.anyBreakTimerStart$.next();

    await wait(100);

    expect(dndService.enable).toHaveBeenCalledTimes(1);

    pomodoroService.workTimerStart$.next();

    await wait(100);

    expect(dndService.disable).toHaveBeenCalledTimes(1);
  });

  it('should handle dnd on autorun', async () => {
    const dndService = createMockProxy<DndService>();
    const pomodoroService = createMockPomodoroService();
    const settingsService = {
      pomodoroSettings: {
        dndOnBreak: true,
        autoRunBreak: true,
        autoRunWork: true,
      },
    };

    pomodoroDnd({
      dndService,
      pomodoroService: pomodoroService as any,
      settingsService: settingsService as any,
    });

    pomodoroService.state.anyBreakStarted$.next();

    await wait(100);

    expect(dndService.enable).toHaveBeenCalledTimes(1);

    pomodoroService.state.workStarted$.next();

    await wait(100);

    expect(dndService.disable).toHaveBeenCalledTimes(1);
  });

  it('should do nothing if dnd mode is already active', async () => {
    const dndService = createMockProxy<DndService>();
    const pomodoroService = createMockPomodoroService();
    const settingsService = {
      pomodoroSettings: {
        dndOnBreak: true,
      },
    };

    pomodoroDnd({
      dndService,
      pomodoroService: pomodoroService as any,
      settingsService: settingsService as any,
    });

    dndService.isEnabled.mockResolvedValue(true);

    pomodoroService.anyBreakTimerStart$.next();

    await wait(100);

    expect(dndService.enable).toHaveBeenCalledTimes(0);

    pomodoroService.workTimerStart$.next();

    await wait(100);

    expect(dndService.disable).toHaveBeenCalledTimes(0);
  });
});
