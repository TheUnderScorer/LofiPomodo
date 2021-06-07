import { renderHook } from '@testing-library/react-hooks';
import { useScrollLock } from './useScrollLock';

describe('Use scroll lock', () => {
  it('should lock and restore scroll', () => {
    document.body.innerHTML = `
      <div id="container" style="overflow: auto">
        <div>
          <div>
            <span>
            Test
            </span>
          </div>
        </div>
      </div>
    `;

    let open = true;

    const element = document.querySelector<HTMLElement>('#container')!;

    const hook = renderHook(() => useScrollLock(open, element));

    expect(getComputedStyle(element).overflow).toEqual('hidden');

    open = false;

    hook.rerender();

    expect(getComputedStyle(element).overflow).toEqual('auto');
  });
});
