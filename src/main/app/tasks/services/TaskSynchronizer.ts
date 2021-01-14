import { TaskApiService } from '../../../../shared/types/taskProviders';
import ElectronStore from 'electron-store';
import { AppStore } from '../../../../shared/types/store';
import { Typed } from 'emittery';
import { Jsonable } from '../../../../shared/types/json';
import {
  TaskSynchronizerEvents,
  TaskSynchronizerEventsPayloadMap,
  TaskSynchronizerJson,
} from '../../../../shared/types/tasks';

export class TaskSynchronizer implements Jsonable<TaskSynchronizerJson> {
  readonly events = new Typed<TaskSynchronizerEventsPayloadMap>();

  private isSyncing = false;
  private lastError?: Error;

  constructor(
    private readonly apiServices: TaskApiService[],
    private readonly store: ElectronStore<AppStore>
  ) {}

  get syncing() {
    return this.isSyncing;
  }

  get lastTaskSyncDate(): Date | undefined {
    const date = this.store.get('lastTasksSyncDate');

    return date ? new Date(date) : undefined;
  }

  set lastTaskSyncDate(date: Date | undefined) {
    this.store.set('lastTasksSyncDate', date);
  }

  async synchronize() {
    if (this.isSyncing) {
      return;
    }

    await this.events.emit(TaskSynchronizerEvents.SyncStarted, this);

    try {
      await Promise.all(this.apiServices.map((service) => service.syncTasks()));

      await this.events.emit(TaskSynchronizerEvents.SyncEnded, this);
    } catch (e) {
      console.error(`Task sync failed:`, e);

      this.lastError = e;

      await this.events.emit(TaskSynchronizerEvents.SyncFailed, {
        error: e,
        service: this,
      });
    } finally {
      this.lastTaskSyncDate = new Date();
    }
  }

  toJSON(): TaskSynchronizerJson {
    return {
      isSyncing: this.isSyncing,
      lastSyncDate: this.lastTaskSyncDate?.toISOString(),
      lastError: this.lastError
        ? {
            message: this.lastError.message,
            name: this.lastError.name,
          }
        : undefined,
    };
  }
}
