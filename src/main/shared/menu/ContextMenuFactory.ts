import { Menu } from 'electron';
import { getPomodoroMenuItems } from '../../app/pomodoro/menu/getPomodoroMenuItems';
import { PomodoroService } from '../../app/pomodoro/services/pomodoroService/PomodoroService';
import { SettingsService } from '../../app/settings/services/SettingsService';

export class ContextMenuFactory {
  constructor(
    private readonly pomodoro: PomodoroService,
    private readonly settingsService: SettingsService
  ) {}

  createTrayContextMenu() {
    return Menu.buildFromTemplate([
      ...getPomodoroMenuItems(this.pomodoro, this.settingsService),
      {
        type: 'separator',
      },
      {
        role: 'quit',
        label: 'Quit',
      },
    ]);
  }
}
