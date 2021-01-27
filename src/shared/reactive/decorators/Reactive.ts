import { reactive } from '../reactive';

export const Reactive = () => (target: any) => {
  return new Proxy(target, {
    construct(targetClass: any, args: any) {
      return reactive(Reflect.construct(targetClass, args));
    },
  });
};
