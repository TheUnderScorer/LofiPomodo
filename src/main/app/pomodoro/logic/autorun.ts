import { PomodoroSettings, PomodoroStates } from '../../../../shared/types';

export const shouldRun = (
  pomodoroStateEnum: PomodoroStates,
  pomodoroSettings: PomodoroSettings
) => {
  if (pomodoroStateEnum === PomodoroStates.Work) {
    return pomodoroSettings.autoRunWork;
  }

  return pomodoroSettings.autoRunBreak;
};
