import { findScrollContainer } from './findScrollContainer';

describe('Find scroll container', () => {
  it('should find scroll container', () => {
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

    const scrollContainer = findScrollContainer(
      document.querySelector('span')!
    );

    expect(scrollContainer?.id).toEqual('container');
  });

  it('should not cause infinite loop', () => {
    document.body.innerHTML = `
      <div id="container" >
        <div>
          <div>
            <span>
            Test
            </span>
          </div>
        </div>
      </div>
    `;

    const scrollContainer = findScrollContainer(
      document.querySelector('span')!
    );

    expect(scrollContainer).toBeNull();
  });
});
