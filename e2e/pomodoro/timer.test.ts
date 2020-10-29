import { getInitialPomodoro } from '../../src/main/app/pomodoro/data';
import { bootstrapTestApp } from '../setup';
import { secondsToTime } from '../../src/shared/utils/time';
import { wait } from '../../src/shared/utils/timeout';

const initialPomodoro = getInitialPomodoro();

describe('Timer - as an user', () => {
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

  it('I should be able to see that it is break after finishing work', async () => {
    const app = await bootstrapTestApp({
      WORK_DURATION_SECONDS: 2,
      BREAK_DURATION_SECONDS: 5,
    });

    const btn = await app.client.$('#control');
    const stateText = await app.client.$('.pomodoro-state-text');

    await btn.click();

    await wait(3000);

    expect(await stateText.getText()).toEqual('Break');
  });

  it('I should be able to skip break', async () => {
    const app = await bootstrapTestApp({
      WORK_DURATION_SECONDS: 2,
      BREAK_DURATION_SECONDS: 1,
    });

    const btn = await app.client.$('#control');
    const stateText = await app.client.$('.pomodoro-state-text');

    await btn.click();

    await wait(3000);

    const skipBreak = await app.client.$('.skip-break');

    await skipBreak.click();

    expect(await stateText.getText()).toEqual('Work');
    expect(await skipBreak.isExisting()).toEqual(false);
  });
});
