import { Element } from 'webdriverio';
import { SpectronClient } from 'spectron';

export type FieldCallback = (
  el: Element,
  client: SpectronClient,
  value?: any
) => Promise<void>;

export interface FieldTestCase {
  setValueCallback: FieldCallback;
  checkValueCallback: FieldCallback;
  selector: string;
}
