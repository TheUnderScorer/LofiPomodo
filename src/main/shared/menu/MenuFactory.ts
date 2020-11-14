import { PomodoroService } from '../../app/pomodoro/services/PomodoroService';
import { Menu, MenuItemConstructorOptions } from 'electron';
import { appMenu, is } from 'electron-util';
import { getNextState } from '../../app/pomodoro/logic/nextState';
import { pomodoroStateDictionary } from '../../../shared/dictionary/pomodoro';
import { keyboardShortcuts } from '../../../shared/keyboardShortcuts';

export class MenuFactory {
  constructor(private readonly pomodoroService: PomodoroService) {}

  createAppMenu() {
    const template: MenuItemConstructorOptions[] = [
      appMenu(),
      {
        label: 'Edit',
        role: 'editMenu',
      },
      {
        label: 'Pomodoro',
        submenu: [
          {
            label: this.pomodoroService.isRunning
              ? 'Pause timer'
              : 'Start timer',
            click: () => this.pomodoroService.toggle(),
            accelerator: keyboardShortcuts.togglePomodoro()?.electronKey,
          },
          {
            label: `Skip to ${
              pomodoroStateDictionary[getNextState(this.pomodoroService)]
            }`,
            click: () => this.pomodoroService.moveToNextState(),
            accelerator: keyboardShortcuts.moveToNextPomodoroState()
              ?.electronKey,
          },
        ],
      },
    ];

    if (is.development) {
      template.push({
        label: 'Dev',
        submenu: [
          {
            label: 'Open dev tools',
            role: 'toggleDevTools',
          },
          {
            label: 'Reload',
            role: 'reload',
          },
        ],
      });
    }

    return Menu.buildFromTemplate(template);
  }
}
