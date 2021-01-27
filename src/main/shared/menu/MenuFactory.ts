import { PomodoroService } from '../../app/pomodoro/services/pomodoroService/PomodoroService';
import { Menu, MenuItemConstructorOptions } from 'electron';
import { appMenu, is } from 'electron-util';
import { getPomodoroMenuItems } from '../../app/pomodoro/menu/getPomodoroMenuItems';
import { SettingsService } from '../../app/settings/services/SettingsService';

export class MenuFactory {
  constructor(
    private readonly pomodoroService: PomodoroService,
    private readonly settingsService: SettingsService
  ) {}

  createAppMenu() {
    const template: MenuItemConstructorOptions[] = [
      appMenu(),
      {
        label: 'Edit',
        role: 'editMenu',
      },
      {
        label: 'Pomodoro',
        submenu: getPomodoroMenuItems(
          this.pomodoroService,
          this.settingsService
        ),
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
