import { PomodoroSettings, PomodoroStateEnum } from '../../../../shared/types';

export const shouldRun = (
  pomodoroStateEnum: PomodoroStateEnum,
  pomodoroSettings: PomodoroSettings
) => {
  if (pomodoroStateEnum === PomodoroStateEnum.Work) {
    return pomodoroSettings.autoRunWork;
  }

  return pomodoroSettings.autoRunBreak;
};
