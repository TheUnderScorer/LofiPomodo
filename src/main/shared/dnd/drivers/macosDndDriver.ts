import { DndDriver } from '../dnd.types';
import * as dnd from '@theunderscorer/do-not-disturb';

export const macosDriver: DndDriver = {
  enable: async () => {
    await dnd.enable();
  },
  disable: async () => {
    await dnd.disable();
  },
  isEnabled: () => dnd.isEnabled(),
};
