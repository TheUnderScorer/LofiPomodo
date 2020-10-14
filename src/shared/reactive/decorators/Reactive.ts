import { reactive } from '../reactive';

export const Reactive = () => (target: any) => {
  const newTarget = function (...args: any[]) {
    return reactive(new target(...args));
  };

  newTarget.prototype = target.prototype;

  return newTarget as any;
};
