import { app } from '../setup';
import { getInitialPomodoro } from '../../src/main/app/pomodoro/data';
import { secondsToTime } from '../../src/shared/utils/time';

const initialPomodoro = getInitialPomodoro();

describe('Timer', () => {
  it('should show timer after starting app', async () => {
    const timer = await app.client.$('#timer');

    await expect(timer.isExisting()).resolves.toEqual(true);

    const progress = await timer.$('.timer-progress');
    const progressText = await progress.getText();

    expect(progressText).toEqual(
      secondsToTime(initialPomodoro.remainingSeconds).toClockString()
    );
  });
});
