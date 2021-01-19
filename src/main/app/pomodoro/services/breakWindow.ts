import { AppContext } from '../../../context';
import { Trigger } from '../../../../shared/types';
import { filter } from 'rxjs/operators';

export const breakWindow = ({ pomodoro, windowFactory }: AppContext) => {
  pomodoro.anyBreakStarted$
    .pipe(filter((value) => value.trigger === Trigger.Scheduled))
    .subscribe(async () => {
      await windowFactory.createBreakWindow();
    });

  pomodoro.workStarted$.subscribe(async () => {
    await windowFactory.breakWindow?.close();
  });
};
