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
      label: pomodoroService.state.isRunning ? 'Pause timer' : 'Start timer',
      click: () => pomodoroService.state.toggle(),
      accelerator: keyboardShortcuts.togglePomodoro()?.electronKey,
    },
    {
      label: `Skip to ${
        pomodoroStateDictionary[
          getNextState(pomodoroService.state, settingsService.pomodoroSettings!)
        ]
      }`,
      click: () => pomodoroService.state.moveToNextState(),
      accelerator: keyboardShortcuts.moveToNextPomodoroState()?.electronKey,
    },
    {
      label: 'Restart pomodoro',
      click: () => pomodoroService.state.restart(),
      accelerator: keyboardShortcuts.restartPomodoro()?.electronKey,
    },
  ];
};
