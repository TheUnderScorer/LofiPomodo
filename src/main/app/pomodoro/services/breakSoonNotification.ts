import { PomodoroService } from './pomodoroService/PomodoroService';
import { Notification } from 'electron';
import { PomodoroStates } from '../../../../shared/types';
import { addSeconds, format } from 'date-fns';
import { NotificationsService } from '../../../shared/notifications/NotificationsService';
import { SettingsService } from '../../settings/services/SettingsService';
import { filter } from 'rxjs/operators';

export interface BreakSoonNotificationDependencies {
  pomodoroService: PomodoroService;
  notificationService: NotificationsService;
  settingsService: SettingsService;
}

const seconds = 60;

export const breakSoonNotification = ({
  pomodoroService,
  notificationService,
  settingsService,
}: BreakSoonNotificationDependencies) => {
  if (!Notification.isSupported()) {
    return;
  }

  pomodoroService.changed$
    .pipe(
      filter(
        (service) =>
          service.remainingSeconds === seconds &&
          service.state === PomodoroStates.Work
      )
    )
    .subscribe(async (service) => {
      if (!settingsService.pomodoroSettings?.showNotificationBeforeBreak) {
        return;
      }

      const date = addSeconds(new Date(), service.remainingSeconds);
      const notification = notificationService.add({
        title: 'Break is starting soon!',
        body: `Break will start at ${format(date, 'HH:mm')}.`,
        actions: [
          {
            text: 'Add 5 minutes',
            type: 'button',
          },
        ],
      });

      notification.addListener('action', () => {
        service.addSeconds(60 * 5);
      });

      notification.show();
    });
};
