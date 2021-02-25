import * as jf from 'joiful';
import { PomodoroSettingsSchema } from '../pomodoro/PomodoroSettingsSchema';
import { BaseSchema } from '../BaseSchema';
import { AppSettings } from '../../types/settings';
import { TaskSettingsSchema } from '../tasks/TaskSettingsSchema';
import { TrelloSettingsSchema } from '../integrations/TrelloSettingsSchema';

export class SettingsFormSchema
  extends BaseSchema<SettingsFormSchema>
  implements AppSettings {
  @(jf.boolean().required())
  autoStart!: boolean;

  @(jf.object({ objectClass: PomodoroSettingsSchema }).required())
  pomodoroSettings!: PomodoroSettingsSchema;

  @(jf.object().optional())
  taskSettings!: TaskSettingsSchema;

  @(jf.object({ objectClass: TrelloSettingsSchema }).optional())
  trello?: TrelloSettingsSchema;
}
