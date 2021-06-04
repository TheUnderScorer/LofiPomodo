import { createMockProxy } from 'jest-mock-proxy';
import { AudioPlayer } from './AudioPlayer';
import { createMockSettings } from '../../../../tests/mocks/settings';
import { Subject } from 'rxjs';
import { PomodoroStates, Trigger } from '../../../../shared/types';
import { pomodoroStateSoundMap, setupPomodoroSounds } from './pomodoroSounds';

describe('Pomodoro sounds', () => {
  const audioPlayer = createMockProxy<AudioPlayer>();
  let settingsService: any;
  let pomodoroService: { stateChanged$: Subject<any> };

  beforeEach(() => {
    audioPlayer.mockClear();

    settingsService = createMockSettings();
    pomodoroService = {
      stateChanged$: new Subject(),
    };
  });

  afterEach(() => {
    pomodoroService.stateChanged$.complete();
  });

  it.each(Object.values(PomodoroStates))(
    'should play sound on state change',
    (pomodoroState) => {
      const expectedKey = pomodoroStateSoundMap[pomodoroState];

      settingsService.pomodoroSettings[expectedKey] = 'test.wav';

      setupPomodoroSounds({
        pomodoroService,
        audioPlayer,
        settingsService,
      } as any);

      pomodoroService.stateChanged$.next({
        trigger: Trigger.Scheduled,
        newState: pomodoroState,
      });

      expect(audioPlayer.play).toHaveBeenCalledWith('test.wav');
    }
  );

  it('should not play on manual trigger', () => {
    settingsService.pomodoroSettings.breakSound = 'test.wav';

    setupPomodoroSounds({
      pomodoroService,
      audioPlayer,
      settingsService,
    } as any);

    pomodoroService.stateChanged$.next({
      trigger: Trigger.Manual,
      newState: PomodoroStates.Break,
    });

    expect(audioPlayer.play).toHaveBeenCalledTimes(0);
  });

  it('should not play if sound is not defined', () => {
    settingsService.pomodoroSettings.workSound = '';

    setupPomodoroSounds({
      pomodoroService,
      audioPlayer,
      settingsService,
    } as any);

    pomodoroService.stateChanged$.next({
      trigger: Trigger.Scheduled,
      newState: PomodoroStates.Work,
    });

    expect(audioPlayer.play).toHaveBeenCalledTimes(0);
  });
});
