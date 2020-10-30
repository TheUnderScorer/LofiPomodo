export const routes = {
  timer: (breakWindow: boolean = false) => {
    if (!breakWindow) {
      return '/timer';
    }

    return '/timer/break';
  },
  tasks: () => '/tasks',
};
