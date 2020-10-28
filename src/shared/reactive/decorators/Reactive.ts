import { reactive } from '../reactive';

export const Reactive = () => (target: any) => {
  const newTarget = function (...args: any[]) {
    return reactive(new target(...args));
  };

  const keys = Object.keys(target);

  keys.forEach((key) => {
    (newTarget as Record<string, any>)[key] = target[key];
  });

  newTarget.prototype = target.prototype;

  return newTarget as any;
};
