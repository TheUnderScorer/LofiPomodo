export interface Changable {
  onChange?: () => void | Promise<void>;
}

export type Subscriber<T> = (
  handler: (entity: Readonly<T>) => void | Promise<void>
) => () => void;

export interface CanSubscribe<T> {
  subscribe: Subscriber<T>;
}
