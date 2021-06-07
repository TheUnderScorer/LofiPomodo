export const findScrollContainer = (element: HTMLElement) => {
  let currentElement = element;

  const container = element.getRootNode();

  while (currentElement !== container) {
    const styles = getComputedStyle(currentElement);

    if (['auto', 'scroll'].includes(styles.overflow)) {
      return currentElement;
    }

    if (!currentElement.parentElement) {
      return null;
    }

    currentElement = currentElement.parentElement;
  }

  return null;
};
