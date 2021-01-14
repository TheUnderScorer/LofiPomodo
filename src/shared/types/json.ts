export interface Jsonable<T extends object = object> {
  toJSON(): T;
}
