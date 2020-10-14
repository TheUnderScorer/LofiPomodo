import { PomodoroService } from './PomodoroService';
import { createMockProxy } from 'jest-mock-proxy';
import ElectronStore from 'electron-store';
import { AppStore } from '../../../../shared/types/store';
import { PomodoroState } from '../../../../shared/types';

describe('PomodoroService', () => {
  let service: PomodoroService;

  const mockStore = createMockProxy<ElectronStore<AppStore>>();

  beforeEach(() => {
    mockStore.mockClear();

    if (service) {
      service.stop();
    }

    service = new PomodoroService(mockStore);
  });

  it('should return correct time', () => {
    jest.useFakeTimers();

    expect(service.remainingTime).toMatchInlineSnapshot(`"16:40"`);
  });

  it('should stop timer if autoRun is set to false', async () => {
    jest.useFakeTimers();

    Object.assign(service, {
      isRunning: true,
      autoRun: false,
      workDurationSeconds: 1,
      remainingSeconds: 1,
      state: PomodoroState.Work,
    });

    jest.advanceTimersByTime(1000);

    expect(service.isRunning).toEqual(false);
    expect(service.state).toEqual(PomodoroState.Break);
    expect(service.remainingTime).toMatchInlineSnapshot(`"08:20"`);
  });

  it('should automatically run next timer if autoRun is set to true', () => {
    jest.useFakeTimers();

    Object.assign(service, {
      isRunning: true,
      autoRun: true,
      workDurationSeconds: 1,
      remainingSeconds: 1,
      state: PomodoroState.Work,
    });

    jest.advanceTimersByTime(2000);

    expect(service.isRunning).toEqual(true);
    expect(service.state).toEqual(PomodoroState.Break);
    expect(service.remainingTime).toMatchInlineSnapshot(`"08:19"`);
  });
});
