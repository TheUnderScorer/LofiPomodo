import { AppContext } from '../../../context';
import { PomodoroState, ToggleMenuPayload } from '../../../../shared/types';
import { Menu } from 'electron';
import { getWindowByTitle } from '../../../shared/windows/getWindowByTitle';
import { WindowTitles } from '../../../shared/windows/factories/WindowFactory';
import { createSectionTitle } from '../../../shared/menu/sectionTitle';
import { createErrorDialog } from '../../../shared/dialog/factories/errorDialog';
import { AppError } from '../../../errors/AppError';
import { createDurationsMenu } from '../menu/menuFactory';

export const handleTimerMenu = (context: AppContext) => async (
  _: unknown,
  { x, y }: ToggleMenuPayload
) => {
  const window = getWindowByTitle(WindowTitles.Timer);
  const isAutoLaunch = await context.autoLaunch.isEnabled();

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
          checked: isAutoLaunch,
          type: 'checkbox',
          click: async () => {
            try {
              if (isAutoLaunch) {
                await context.autoLaunch.disable();
              } else {
                await context.autoLaunch.enable();
              }
            } catch (e) {
              await createErrorDialog(
                AppError.fromError(e, {
                  title: 'Unable to toggle startup option.',
                })
              );
            }
          },
        },
        {
          type: 'separator',
        },

        {
          ...createSectionTitle('Durations'),
        },
        {
          label: 'Work duration',
          submenu: [
            ...createDurationsMenu(
              context.pomodoro.workDurationSeconds,
              (value) => {
                context.pomodoro.setDuration(value.seconds, PomodoroState.Work);
              }
            ),
          ],
        },
        {
          label: 'Break duration',
          submenu: [
            ...createDurationsMenu(
              context.pomodoro.shortBreakDurationSeconds,
              (value) => {
                context.pomodoro.setDuration(
                  value.seconds,
                  PomodoroState.Break
                );
              }
            ),
          ],
        },
        {
          label: 'Long break duration',
          submenu: [
            ...createDurationsMenu(
              context.pomodoro.longBreakDurationSeconds,
              (value) => {
                context.pomodoro.setDuration(
                  value.seconds,
                  PomodoroState.LongBreak
                );
              }
            ),
          ],
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
        {
          label: 'Start break automatically',
          checked: context.pomodoro.autoRunBreak,
          type: 'checkbox',
          click: () => {
            context.pomodoro.autoRunBreak = !context.pomodoro.autoRunBreak;
          },
        },
        {
          label: 'Start work automatically',
          checked: context.pomodoro.autoRunWork,
          type: 'checkbox',
          click: () => {
            context.pomodoro.autoRunWork = !context.pomodoro.autoRunWork;
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
