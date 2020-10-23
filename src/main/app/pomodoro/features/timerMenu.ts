import { AppContext } from '../../../context';
import { ToggleMenuPayload } from '../../../../shared/types';
import { Menu } from 'electron';
import { getWindowByTitle } from '../../../shared/windows/getWindowByTitle';
import { WindowTitles } from '../../../shared/windows/factories/WindowFactory';
import { createSectionTitle } from '../../../shared/menu/menuFactory';

export const handleTimerMenu = (context: AppContext) => async (
  _: unknown,
  { x, y }: ToggleMenuPayload
) => {
  const window = getWindowByTitle(WindowTitles.Timer);

  const menu = Menu.buildFromTemplate([
    {
      label: 'Options',
      type: 'submenu',
      submenu: [
        {
          ...createSectionTitle('Startup'),
        },
        {
          label: 'Launch on start',
          checked: true,
          type: 'checkbox',
          sublabel: 'Test',
        },
        {
          type: 'separator',
        },
        {
          ...createSectionTitle('General'),
        },
        {
          label: 'Open full-screen window on break start',
          checked: context.pomodoro.openFullWindowOnBreak,
          type: 'checkbox',
          click: () => {
            context.pomodoro.openFullWindowOnBreak = !context.pomodoro
              .openFullWindowOnBreak;
          },
        },
      ],
    },
  ]);

  menu.popup({
    window,
    x,
    y,
  });
};
