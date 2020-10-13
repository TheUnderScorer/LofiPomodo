import { getDurationByState, getNextState } from './nextState';
import { Pomodoro, PomodoroState } from '../../../../shared/types';
import { getInitialPomodoro } from '../data';

describe('Next state', () => {
  it.each<[PomodoroState, keyof Pomodoro]>([
    [PomodoroState.Break, 'shortBreakDurationSeconds'],
    [PomodoroState.LongBreak, 'longBreakDurationSeconds'],
    [PomodoroState.Work, 'workDurationSeconds'],
  ])('should return correct duration by state', (state, prop) => {
    const pomodoro: Pomodoro = {
      ...getInitialPomodoro(),
      state,
    };

    const duration = getDurationByState(pomodoro, state);
    expect(duration).toEqual(pomodoro[prop]);
  });

  it.each<[PomodoroState, PomodoroState, number | undefined]>([
    [PomodoroState.LongBreak, PomodoroState.Work, undefined],
    [PomodoroState.Break, PomodoroState.Work, undefined],
    [PomodoroState.Work, PomodoroState.Break, undefined],
    [PomodoroState.Work, PomodoroState.LongBreak, 4],
  ])(
    'should return correct next state',
    (currentState, expectedNextState, shortBreakCount) => {
      const pomodoro: Pomodoro = {
        ...getInitialPomodoro(),
        state: currentState,
        shortBreakCount: shortBreakCount ?? 0,
      };

      const nextState = getNextState(pomodoro);
      expect(nextState).toEqual(expectedNextState);
    }
  );
});
