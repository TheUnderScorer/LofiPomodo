import { is } from 'electron-util';
import { DndDriver } from './dnd.types';
import { macosDriver } from './drivers/macosDndDriver';

export class DndService implements DndDriver {
  readonly supported: boolean;

  private readonly driver?: DndDriver;

  constructor() {
    this.supported = is.macos;

    this.driver = is.macos ? macosDriver : undefined;

    console.info(
      `DND is ${this.supported ? 'supported' : 'not supported'} on this os.`
    );
  }

  async isEnabled() {
    if (!this.supported) {
      return false;
    }

    return this.driver!.isEnabled();
  }

  async enable() {
    if (!this.supported) {
      return;
    }

    return this.driver!.enable();
  }

  async disable() {
    if (!this.supported) {
      return;
    }

    return this.driver!.disable();
  }
}
