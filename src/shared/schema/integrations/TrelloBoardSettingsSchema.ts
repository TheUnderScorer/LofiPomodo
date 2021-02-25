import { BaseSchema } from '../BaseSchema';
import { TrelloBoardSettings } from '../../types/integrations/trello';
import * as jf from 'joiful';

export class TrelloBoardSettingsSchema
  extends BaseSchema<TrelloBoardSettingsSchema>
  implements TrelloBoardSettings {
  @(jf.string().optional())
  id?: string;

  @(jf.string().optional())
  doneListId?: string;

  @(jf.string().optional())
  boardId?: string;

  @(jf.array().items((joi) => joi.string()))
  listIds?: string[];
}
