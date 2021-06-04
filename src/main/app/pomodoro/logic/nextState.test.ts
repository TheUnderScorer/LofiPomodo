import { getDurationByState, getNextState } from './nextState';
import {
  PomodoroSettings,
  PomodoroState,
  PomodoroStates,
} from '../../../../shared/types';
import { getInitialPomodoroSettings, getInitialPomodoroState } from '../data';

describe('Next state', () => {
  it.each<[PomodoroStates, keyof PomodoroSettings]>([
    [PomodoroStates.Break, 'shortBreakDurationSeconds'],
    [PomodoroStates.LongBreak, 'longBreakDurationSeconds'],
    [PomodoroStates.Work, 'workDurationSeconds'],
  ])('should return correct duration by state', (state, prop) => {
    const pomodoroSettings = getInitialPomodoroSettings();

    const duration = getDurationByState(pomodoroSettings, state);
    expect(duration).toEqual(pomodoroSettings[prop]);
  });

  it.each<[PomodoroStates, PomodoroStates, number | undefined]>([
    [PomodoroStates.LongBreak, PomodoroStates.Work, undefined],
    [PomodoroStates.Break, PomodoroStates.Work, undefined],
    [PomodoroStates.Work, PomodoroStates.Break, undefined],
    [PomodoroStates.Work, PomodoroStates.LongBreak, 4],
  ])(
    'should return correct next state',
    (currentState, expectedNextState, shortBreakCount) => {
      const pomodoroState: PomodoroState = {
        ...getInitialPomodoroState(),
        state: currentState,
        shortBreakCount: shortBreakCount ?? 0,
      };

      const pomodoroSettings = getInitialPomodoroSettings();

      const nextState = getNextState(pomodoroState, pomodoroSettings);
      expect(nextState).toEqual(expectedNextState);
    }
  );
});
