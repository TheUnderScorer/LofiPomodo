import fetch from 'node-fetch';

export const waitForRenderer = async () => {
  return new Promise<void>((resolve) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3000');

        if (response.status === 200) {
          clearInterval(intervalId);
          resolve();
        }
      } catch {
        // Nothing here ;)
      }
    }, 2000);
  });
};
