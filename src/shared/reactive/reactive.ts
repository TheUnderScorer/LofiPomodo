import { CanSubscribe, Changable } from '../types';

export const reactive = <T extends Changable>(
  object: T
): T & CanSubscribe<T> => {
  const subscribers: Function[] = [];

  const triggerSubscribers = async (target: T) => {
    await Promise.all(subscribers.map(sub => sub(target)));
  };

  let isOnChange = false;

  const castedObject = object as T & CanSubscribe<T>;

  castedObject.subscribe = function(handler) {
    const index = subscribers.push(handler) - 1;

    return () => {
      subscribers.splice(index, 1);
    };
  };

  return new Proxy<T & CanSubscribe<T>>(castedObject, {
    set(target: T, p: keyof T, value: any): boolean {
      target[p] = value;

      triggerSubscribers(target);

      if (!isOnChange) {
        target.onChange();
        isOnChange = false;
      }

      return true;
    },
  });
};
