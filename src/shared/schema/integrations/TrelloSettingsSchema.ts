import * as jf from 'joiful';
import { BaseSchema } from '../BaseSchema';
import { TrelloMember, TrelloSettings } from '../../types/integrations/trello';
import { TrelloBoardSettingsSchema } from './TrelloBoardSettingsSchema';

export class TrelloSettingsSchema
  extends BaseSchema<TrelloSettingsSchema>
  implements TrelloSettings {
  @(jf.string().optional())
  userToken?: string;

  @(jf.object().optional())
  member?: TrelloMember;

  @(jf.array({ elementClass: TrelloBoardSettingsSchema }).optional())
  boards?: TrelloBoardSettingsSchema[];
}
