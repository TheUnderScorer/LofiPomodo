import { DeepPartial, OmitFunctions, Constructor } from '../types';

export abstract class DataObject<Entity> {
  fill(payload: Partial<Entity>): this {
    Object.assign(this, payload);

    return this;
  }

  clone(): this {
    const instance = new (this.constructor as Constructor<DataObject<any>>)();

    instance.fill(this);

    return instance as this;
  }

  static create<T extends DataObject<any>>(
    this: { new (): T },
    payload: DeepPartial<OmitFunctions<T>>
  ) {
    const entity = new this();

    return entity.fill(payload);
  }
}
