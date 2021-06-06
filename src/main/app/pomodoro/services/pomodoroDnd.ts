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

  pomodoroService.anyBreakStarted$.subscribe(async () => {
    const isEnabled = await dndService.isEnabled();

    if (!settingsService.pomodoroSettings?.dndOnBreak || isEnabled) {
      return;
    }

    await dndService.enable();

    wasDndStarted = true;
  });

  pomodoroService.workStarted$.subscribe(async () => {
    if (wasDndStarted) {
      wasDndStarted = false;

      await dndService.disable();
    }
  });
};
