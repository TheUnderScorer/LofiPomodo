import { validate } from './validate';
import { Constructor } from '../types';

export interface BaseSchemaConstructor<T extends BaseSchema<any>>
  extends Constructor<T> {
  validate: (payload: any) => T;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BaseSchema<T> {
  static validate<T extends BaseSchema<any>>(
    this: { new (): T },
    payload: any
  ) {
    return validate(payload, this);
  }
}
