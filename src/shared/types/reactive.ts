export interface Changable {
  onChange: () => void | Promise<void>;
}

export interface CanSubscribe<T> {
  subscribe: (
    handler: (entity: Readonly<T>) => void | Promise<void>
  ) => () => void;
}
