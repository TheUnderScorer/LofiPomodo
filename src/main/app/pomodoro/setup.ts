import { AppContext } from '../../context';
import { BrowserWindow } from 'electron';
import { PomodoroEvents } from '../../../shared/types';

export const setupPomodoro = (context: AppContext) => {
  sendUpdatesToWindows(context);
};

const sendUpdatesToWindows = ({ pomodoro }: AppContext) => {
  pomodoro.subscribe((data) => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(PomodoroEvents.Updated, data);
    });
  });
};
