import { CanSubscribe, Changable } from '../types';

export const reactive = <T extends Changable>(
  object: T
): T & CanSubscribe<T> => {
  const subscribers: Function[] = [];

  const triggerSubscribers = async (target: T) => {
    await Promise.all(subscribers.map(sub => sub(target)));
  };

  const castedObject = object as T & CanSubscribe<T>;
  const orgOnChange = castedObject.onChange.bind(castedObject);

  castedObject.onChange = function() {
    orgOnChange();
    triggerSubscribers(this);
  };

  castedObject.subscribe = function(handler) {
    const index = subscribers.push(handler) - 1;

    return () => {
      subscribers.splice(index, 1);
    };
  };

  return new Proxy<T & CanSubscribe<T>>(castedObject, {
    set(target: T, p: keyof T, value: any): boolean {
      target[p] = value;

      target.onChange.call(target);

      return true;
    },
  });
};
