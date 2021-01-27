import { getDurationByState } from '../logic/nextState';
import { WindowFactory } from '../../../shared/windows/factories/WindowFactory';
import { PomodoroService } from './pomodoroService/PomodoroService';
import { SettingsService } from '../../settings/services/SettingsService';
import { is } from 'electron-util';

export interface ShowTrayProgressDependencies {
  windowFactory: WindowFactory;
  pomodoroService: PomodoroService;
  settingsService: SettingsService;
}

export const showTrayProgress = ({
  pomodoroService,
  settingsService,
  windowFactory,
}: ShowTrayProgressDependencies) => {
  if (!is.windows) {
    return;
  }

  pomodoroService.changed$.subscribe(() => {
    const { timerWindow } = windowFactory;

    if (timerWindow) {
      const duration = getDurationByState(
        settingsService.pomodoroSettings!,
        pomodoroService.state
      );
      const percentage = pomodoroService.remainingSeconds / duration;

      timerWindow.setProgressBar(1 - percentage);
    }
  });
};
