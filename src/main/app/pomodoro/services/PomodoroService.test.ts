import { PomodoroService } from './PomodoroService';
import { createMockProxy } from 'jest-mock-proxy';
import ElectronStore from 'electron-store';
import { AppStore } from '../../../../shared/types/store';
import { PomodoroState } from '../../../../shared/types';
import { wait } from '../../../../shared/utils/timeout';

describe('PomodoroService', () => {
  let service: PomodoroService;

  const mockStore = createMockProxy<ElectronStore<AppStore>>();

  beforeEach(() => {
    mockStore.mockClear();

    if (service) {
      service.stop();
    }

    service = new PomodoroService(mockStore);

    service.fill({
      workDurationSeconds: 1,
      remainingSeconds: 1,
    });
  });

  it('should return correct time', () => {
    jest.useFakeTimers();

    expect(service.remainingTime).toMatchInlineSnapshot(`"00:01"`);
  });

  it('should stop timer after work if auto run is set to false', async () => {
    jest.useFakeTimers();

    service.fill({
      isRunning: true,
      autoRunBreak: false,
      autoRunWork: false,
      workDurationSeconds: 1,
      shortBreakDurationSeconds: 5,
      remainingSeconds: 1,
    });

    jest.advanceTimersByTime(3000);

    jest.useRealTimers();

    await wait(1000);

    expect(service.isRunning).toEqual(false);
    expect(service.state).toEqual(PomodoroState.Break);
    expect(service.remainingTime).toMatchInlineSnapshot(`"00:05"`);
  });

  it('should automatically run next timer if autoRunBreak and autoRunWork is set to true', async () => {
    jest.useFakeTimers();

    service.fill({
      isRunning: true,
      autoRunBreak: true,
      autoRunWork: true,
      workDurationSeconds: 1,
      remainingSeconds: 1,
      shortBreakDurationSeconds: 2,
      state: PomodoroState.Work,
    });

    jest.advanceTimersByTime(2000);
    jest.useRealTimers();

    await wait(1000);

    expect(service.isRunning).toEqual(true);
    expect(service.state).toEqual(PomodoroState.Break);
    expect(service.remainingTime).toMatchInlineSnapshot(`"00:02"`);

    jest.useFakeTimers();
    jest.advanceTimersByTime(4000);
    jest.useRealTimers();

    await wait(2000);

    expect(service.isRunning).toEqual(true);
    expect(service.state).toEqual(PomodoroState.Work);
  });
});
