import { getInitialPomodoro } from '../../src/main/app/pomodoro/data';
import { bootstrapTestApp } from '../setup';
import { secondsToTime } from '../../src/shared/utils/time';
import { wait } from '../../src/shared/utils/timeout';

const initialPomodoro = getInitialPomodoro();

describe('Timer', () => {
  describe('As an user', () => {
    it('I should see timer after starting up', async () => {
      const app = await bootstrapTestApp();

      const timer = await app.client.$('#timer');

      await expect(timer.isExisting()).resolves.toEqual(true);

      const progress = await timer.$('.timer-progress');
      const progressText = await progress.getText();

      expect(progressText).toEqual(
        secondsToTime(initialPomodoro.remainingSeconds).toClockString()
      );
    });

    it('I should be able to pause/run pomodoro', async () => {
      const app = await bootstrapTestApp({
        WORK_DURATION_SECONDS: 10,
      });

      const btn = await app.client.$('#control');
      const timerTextEl = await app.client.$('.timer-text');
      const icon = await btn.$('.pomodoro-control-icon');

      const timerText = await timerTextEl.getText();
      expect(timerText).toEqual('00:10');

      await btn.click();

      let iconClass = await icon.getAttribute('class');

      expect(iconClass).toContain('fa-pause');

      await wait(2000);

      await btn.click();

      iconClass = await icon.getAttribute('class');
      const newTimerText = await timerTextEl.getText();

      expect(iconClass).toContain('fa-play');
      expect(newTimerText).toEqual('00:08');
    });
  });
});
