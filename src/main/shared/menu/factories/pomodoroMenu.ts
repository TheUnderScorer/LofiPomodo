import { Menu } from 'electron';
import { appMenu } from 'electron-util';

export const createPomodoroMenu = () => {
  return Menu.buildFromTemplate([appMenu()]);
};
