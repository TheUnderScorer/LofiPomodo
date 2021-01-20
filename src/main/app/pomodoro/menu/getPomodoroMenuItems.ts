import { keyboardShortcuts } from '../../../../shared/keyboardShortcuts';
import { pomodoroStateDictionary } from '../../../../shared/dictionary/pomodoro';
import { getNextState } from '../logic/nextState';
import { PomodoroService } from '../services/pomodoroService/PomodoroService';

export const getPomodoroMenuItems = (pomodoroService: PomodoroService) => [
  {
    label: pomodoroService.isRunning ? 'Pause timer' : 'Start timer',
    click: () => pomodoroService.toggle(),
    accelerator: keyboardShortcuts.togglePomodoro()?.electronKey,
  },
  {
    label: `Skip to ${pomodoroStateDictionary[getNextState(pomodoroService)]}`,
    click: () => pomodoroService.moveToNextState(),
    accelerator: keyboardShortcuts.moveToNextPomodoroState()?.electronKey,
  },
  {
    label: 'Restart pomodoro',
    click: () => pomodoroService.restart(),
    accelerator: keyboardShortcuts.restartPomodoro()?.electronKey,
  },
];
