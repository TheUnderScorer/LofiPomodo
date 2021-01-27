import { keyboardShortcuts } from '../../../../shared/keyboardShortcuts';
import { pomodoroStateDictionary } from '../../../../shared/dictionary/pomodoro';
import { getNextState } from '../logic/nextState';
import { PomodoroService } from '../services/pomodoroService/PomodoroService';
import { SettingsService } from '../../settings/services/SettingsService';

export const getPomodoroMenuItems = (
  pomodoroService: PomodoroService,
  settingsService: SettingsService
) => {
  return [
    {
      label: pomodoroService.isRunning ? 'Pause timer' : 'Start timer',
      click: () => pomodoroService.toggle(),
      accelerator: keyboardShortcuts.togglePomodoro()?.electronKey,
    },
    {
      label: `Skip to ${
        pomodoroStateDictionary[
          getNextState(pomodoroService, settingsService.pomodoroSettings!)
        ]
      }`,
      click: () => pomodoroService.moveToNextState(),
      accelerator: keyboardShortcuts.moveToNextPomodoroState()?.electronKey,
    },
    {
      label: 'Restart pomodoro',
      click: () => pomodoroService.restart(),
      accelerator: keyboardShortcuts.restartPomodoro()?.electronKey,
    },
  ];
};
