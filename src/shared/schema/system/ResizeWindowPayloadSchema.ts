import { ResizeWindowPayload } from '../../types/system';
import * as jf from 'joiful';
import { BaseSchema } from '../BaseSchema';

export class ResizeWindowPayloadSchema
  extends BaseSchema<ResizeWindowPayloadSchema>
  implements ResizeWindowPayload {
  @(jf.boolean().default(true).optional())
  animate?: boolean;

  @(jf.number().positive().required())
  height!: number;

  @(jf.number().positive().required())
  width!: number;
}
