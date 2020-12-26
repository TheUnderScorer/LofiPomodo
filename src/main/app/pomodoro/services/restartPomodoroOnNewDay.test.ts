import { restartPomodoroOnNewDay } from './restartPomodoroOnNewDay';

describe('Restart pomodoro on new day', () => {
  const mockPomodoro: any = {
    restart: jest.fn(),
  };

  beforeEach(() => {
    mockPomodoro.restart.mockClear();
  });

  it('should not restart pomodoro on the same day', async () => {
    mockPomodoro.start = new Date();

    await restartPomodoroOnNewDay(mockPomodoro);

    expect(mockPomodoro.restart).toBeCalledTimes(0);
  });

  it('should restart pomodoro on new day', async () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    mockPomodoro.start = date;

    await restartPomodoroOnNewDay(mockPomodoro);

    expect(mockPomodoro.restart).toBeCalledTimes(1);
  });
});
