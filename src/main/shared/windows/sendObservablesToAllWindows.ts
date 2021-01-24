import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { sendEventToAllWindows } from './sendEventToAllWindows';
import { isJsonable } from '../../../shared/utils/json';

export const sendObservablesToWindows = (
  observableMap: Record<string, Observable<any>>
) => {
  const mappedObservables = Object.entries(observableMap).map(
    ([event, observable$]) => {
      // Include event name in every observable payload
      return observable$.pipe(
        map((payload) => {
          const jsonPayload = isJsonable(payload) ? payload.toJSON() : payload;

          return {
            ...(jsonPayload ?? {}),
            _event: event,
          };
        })
      );
    }
  );

  const merged$ = merge<Record<string, any>>(...mappedObservables);

  merged$.subscribe((payload) => {
    const { _event, ...rest } = payload;

    sendEventToAllWindows(_event, rest);
  });

  return merged$;
};
