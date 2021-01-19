import { Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { sendEventToAllWindows } from './sendEventToAllWindows';

export const sendObservablesToWindows = (
  observableMap: Record<string, Observable<any>>
) => {
  const mappedObservables = Object.entries(observableMap).map(
    ([event, observable$]) => {
      // Include event name in every observable payload
      return observable$.pipe(
        map((payload) => ({
          ...(payload ?? {}),
          _event: event,
        }))
      );
    }
  );

  const merged$ = merge<Record<string, any>>(mappedObservables);

  merged$.subscribe((payload) => {
    const { _event, ...rest } = payload;

    sendEventToAllWindows(_event, rest);
  });

  return merged$;
};
