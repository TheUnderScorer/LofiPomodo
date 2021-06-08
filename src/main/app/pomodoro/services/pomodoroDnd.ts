import { DndService } from '../../../shared/dnd/DndService';
import { PomodoroService } from './pomodoroService/PomodoroService';
import { SettingsService } from '../../settings/services/SettingsService';

export interface PomodoroDndDependencies {
  dndService: DndService;
  pomodoroService: PomodoroService;
  settingsService: SettingsService;
}

export const pomodoroDnd = ({
  dndService,
  pomodoroService,
  settingsService,
}: PomodoroDndDependencies) => {
  let wasDndStarted = false;

  if (!dndService.supported) {
    return;
  }

  const startDnd = async () => {
    const isEnabled = await dndService.isEnabled();

    if (!settingsService.pomodoroSettings?.dndOnBreak || isEnabled) {
      return;
    }

    await dndService.enable();

    wasDndStarted = true;
  };

  const stopDnd = async () => {
    if (wasDndStarted) {
      wasDndStarted = false;

      await dndService.disable();
    }
  };

  pomodoroService.state.anyBreakStarted$.subscribe(async () => {
    if (settingsService.pomodoroSettings?.autoRunBreak) {
      // Run DnD if autorun is set, since we won't receive timer start
      await startDnd();
    }
  });

  pomodoroService.state.workStarted$.subscribe(async () => {
    if (settingsService.pomodoroSettings?.autoRunWork) {
      // Stop DnD if autorun is set, since we won't receive timer start
      await stopDnd();
    }
  });

  pomodoroService.anyBreakTimerStart$.subscribe(async () => {
    await startDnd();
  });

  pomodoroService.workTimerStart$.subscribe(async () => {
    await stopDnd();
  });
};
