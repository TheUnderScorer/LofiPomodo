import { Notification, NotificationConstructorOptions } from 'electron';

export class NotificationsService {
  private readonly notifications = new Set<Notification>();

  private static events = ['close', 'click', 'action', 'reply'];

  add(config: NotificationConstructorOptions, show?: boolean) {
    const notification = new Notification(config);

    this.registerNotification(notification);

    if (show) {
      notification.show();
    }

    return notification;
  }

  private registerNotification(notification: Notification) {
    NotificationsService.events.forEach((event) => {
      const callback = () => {
        this.notifications.delete(notification);

        notification.removeAllListeners();
      };

      notification.addListener(event as any, callback);
    });
  }
}
