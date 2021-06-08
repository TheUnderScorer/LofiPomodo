import { restartPomodoroOnNewDay } from './restartPomodoroOnNewDay';

describe('Restart pomodoro on new day', () => {
  const mockPomodoro: any = {
    state: {
      restart: jest.fn(),
    },
  };

  beforeEach(() => {
    mockPomodoro.state.restart.mockClear();
  });

  it('should not restart pomodoro on the same day', async () => {
    mockPomodoro.state.start = new Date();

    await restartPomodoroOnNewDay(mockPomodoro);

    expect(mockPomodoro.state.restart).toBeCalledTimes(0);
  });

  it('should restart pomodoro on new day', async () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    mockPomodoro.state.start = date;

    await restartPomodoroOnNewDay(mockPomodoro);

    expect(mockPomodoro.state.restart).toBeCalledTimes(1);
  });
});
