import { BaseSchema } from '../BaseSchema';
import { TaskSettings } from '../../types/tasks';
import * as jf from 'joiful';

export class TaskSettingsSchema
  extends BaseSchema<TaskSettingsSchema>
  implements TaskSettings {
  @(jf.boolean().optional())
  showToggleTaskListBtn?: boolean;
}
