import { createMockProxy } from 'jest-mock-proxy';
import { pomodoroDnd } from './pomodoroDnd';
import { DndService } from '../../../shared/dnd/DndService';
import { Subject } from 'rxjs';
import { wait } from '../../../../shared/utils/timeout';

describe('Pomodoro dnd', () => {
  it('should start and stop dnd mode if enabled', async () => {
    const dndService = createMockProxy<DndService>();
    const pomodoroService = {
      anyBreakTimerStart$: new Subject(),
      workTimerStart$: new Subject(),
    };
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

  it('should do nothing if dnd mode is already active', async () => {
    const dndService = createMockProxy<DndService>();
    const pomodoroService = {
      anyBreakTimerStart$: new Subject(),
      workTimerStart$: new Subject(),
    };
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
