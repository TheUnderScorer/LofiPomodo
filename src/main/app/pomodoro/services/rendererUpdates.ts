import { AppContext } from '../../../context';
import { PomodoroEvents } from '../../../../shared/types';
import { BrowserWindow } from 'electron';

export const sendUpdatesToWindows = ({ pomodoro }: AppContext) => {
  pomodoro.changed$.subscribe((data) => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(PomodoroEvents.Updated, data.toJSON());
    });
  });
};
