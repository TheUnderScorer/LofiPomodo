import { getInitialPomodoroSettings } from '../../main/app/pomodoro/data';
import { Subject } from 'rxjs';

export const createMockSettings = () => ({
  pomodoroSettings: {
    ...getInitialPomodoroSettings(),
  },
  settingsChanged$: new Subject(),
});
