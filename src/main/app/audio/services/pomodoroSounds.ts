import { PomodoroService } from '../../pomodoro/services/pomodoroService/PomodoroService';
import {
  PomodoroSettings,
  PomodoroStateEnum,
  Trigger,
} from '../../../../shared/types';
import { SettingsService } from '../../settings/services/SettingsService';
import { filter } from 'rxjs/operators';
import { AudioPlayer } from './AudioPlayer';

export const pomodoroStateSoundMap: Record<
  PomodoroStateEnum,
  keyof PomodoroSettings
> = {
  [PomodoroStateEnum.Break]: 'breakSound',
  [PomodoroStateEnum.Work]: 'workSound',
  [PomodoroStateEnum.LongBreak]: 'longBreakSound',
};

interface PomodoroSoundsDependencies {
  pomodoroService: PomodoroService;
  settingsService: SettingsService;
  audioPlayer: AudioPlayer;
}

export const setupPomodoroSounds = ({
  pomodoroService,
  settingsService,
  audioPlayer,
}: PomodoroSoundsDependencies) => {
  pomodoroService.stateChanged$
    .pipe(filter(({ trigger }) => trigger === Trigger.Scheduled))
    .subscribe(async ({ newState }) => {
      const soundKey = pomodoroStateSoundMap[newState];

      const soundToPlay = settingsService.pomodoroSettings![soundKey];

      if (!soundToPlay) {
        return;
      }

      await audioPlayer.play(soundToPlay as string);
    });
};
