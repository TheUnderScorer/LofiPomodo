import debounce from 'lodash.debounce';
import { ChangeSubject, Changable } from '../types';
import { Subject } from 'rxjs';

export const reactive = <T extends Changable>(
  object: T
): T & ChangeSubject<T> => {
  const subject = new Subject<T>();

  const castedObject = object as T & ChangeSubject<T>;
  const orgOnChange = castedObject.onChange?.bind(castedObject) ?? (() => {});

  const onChange = function (this: T & ChangeSubject<T>) {
    orgOnChange();

    subject.next(this);
  };

  castedObject.onChange = debounce(onChange, 2);

  castedObject.changed$ = subject;

  return new Proxy<T & ChangeSubject<T>>(castedObject, {
    set(target: T, p: keyof T, value: any): boolean {
      target[p] = value;

      target.onChange!.call(target);

      return true;
    },
  });
};
