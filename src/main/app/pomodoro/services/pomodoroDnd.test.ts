import { createMockProxy } from 'jest-mock-proxy';
import { pomodoroDnd } from './pomodoroDnd';
import { DndService } from '../../../shared/dnd/DndService';
import { Subject } from 'rxjs';
import { wait } from '../../../../shared/utils/timeout';

describe('Pomodoro dnd', () => {
  it('should start and stop dnd mode if enabled', async () => {
    const dndService = createMockProxy<DndService>();
    const pomodoroService = {
      anyBreakStarted$: new Subject(),
      workStarted$: new Subject(),
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

    pomodoroService.anyBreakStarted$.next();

    await wait(100);

    expect(dndService.enable).toHaveBeenCalledTimes(1);

    pomodoroService.workStarted$.next();

    await wait(100);

    expect(dndService.disable).toHaveBeenCalledTimes(1);
  });

  it('should do nothing if dnd mode is already active', async () => {
    const dndService = createMockProxy<DndService>();
    const pomodoroService = {
      anyBreakStarted$: new Subject(),
      workStarted$: new Subject(),
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

    pomodoroService.anyBreakStarted$.next();

    await wait(100);

    expect(dndService.enable).toHaveBeenCalledTimes(0);

    pomodoroService.workStarted$.next();

    await wait(100);

    expect(dndService.disable).toHaveBeenCalledTimes(0);
  });
});
