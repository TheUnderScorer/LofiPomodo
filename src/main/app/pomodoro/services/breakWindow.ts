import { Trigger } from '../../../../shared/types';
import { filter } from 'rxjs/operators';
import { SettingsService } from '../../settings/services/SettingsService';
import { WindowFactory } from '../../../shared/windows/factories/WindowFactory';
import { PomodoroService } from './pomodoroService/PomodoroService';

interface BreakWindowParams {
  settingsService: SettingsService;
  windowFactory: WindowFactory;
  pomodoroService: PomodoroService;
}

export const breakWindow = ({
  settingsService,
  windowFactory,
  pomodoroService,
}: BreakWindowParams) => {
  pomodoroService.anyBreakStarted$
    .pipe(filter((value) => value.trigger === Trigger.Scheduled))
    .subscribe(async () => {
      if (!settingsService.pomodoroSettings?.openFullWindowOnBreak) {
        return;
      }

      await windowFactory.createBreakWindow();
    });

  pomodoroService.workStarted$.subscribe(async () => {
    await windowFactory.breakWindow?.close();
  });
};
