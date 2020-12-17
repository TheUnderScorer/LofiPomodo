import { reactive } from './reactive';
import { Changable } from '../types';
import { wait } from '../utils/timeout';

describe('Reactive', () => {
  const onChange = jest.fn();

  const createReactive = () =>
    reactive(
      new (class implements Changable {
        val1: number = 0;
        val2: string = '';

        onChange() {
          onChange(this);
        }
      })()
    );

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('onChange', () => {
    it('should trigger on property change', async () => {
      const obj = createReactive();

      obj.val1 = 2;

      await wait(2);

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should not cause loop when property is changed inside onChange handler', async () => {
      onChange.mockImplementation((obj: ReturnType<typeof createReactive>) => {
        obj.val2 = 'test';
      });

      const obj = createReactive();
      obj.val1 = 2;

      await wait(2);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(obj.val2).toEqual('test');
    });
  });

  describe('subscribe', () => {
    const subscriber = jest.fn();

    beforeEach(() => {
      subscriber.mockClear();
    });

    it('should call subscribers on change', async () => {
      const obj = createReactive();
      obj.subscribe(subscriber);
      obj.val2 = 'test';

      await wait(2);

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(obj);
    });

    it('should return function to unregister subscriber', () => {
      const obj = createReactive();
      const unregister = obj.subscribe(subscriber);
      unregister();

      obj.val2 = 'test';

      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });
});
