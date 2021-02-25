import { BaseSchema } from '../BaseSchema';
import { PomodoroSettings } from '../../types';
import * as jf from 'joiful';
import { duration } from '../decorators/duration';
import { audio } from '../decorators/audio';

export class PomodoroSettingsSchema
  extends BaseSchema<PomodoroSettingsSchema>
  implements PomodoroSettings {
  @(jf.boolean().required())
  autoRunBreak!: boolean;

  @(jf.boolean().required())
  autoRunWork!: boolean;

  @audio()
  breakSound?: string;

  @duration()
  longBreakDurationSeconds!: number;

  @(jf.number().integer().min(1).max(10).required())
  longBreakInterval!: number;

  @audio()
  longBreakSound?: string;

  @(jf.boolean().required())
  openFullWindowOnBreak!: boolean;

  @duration()
  shortBreakDurationSeconds!: number;

  @(jf.boolean().optional())
  showNotificationBeforeBreak?: boolean;

  @duration()
  workDurationSeconds!: number;

  @audio()
  workSound?: string;
}
