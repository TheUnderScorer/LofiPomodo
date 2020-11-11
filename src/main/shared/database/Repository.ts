import {
  BaseModel,
  BaseRepository,
  Tables,
} from '../../../shared/types/database';
import Knex, { QueryBuilder } from 'knex';
import { castAsArray } from '../../../shared/utils/array';
import { Typed as EventEmitter } from 'emittery';

export enum RepositoryEvents {
  EntityUpdated = 'EntityUpdated',
  EntitiesCreated = 'EntitiesCreated',
}

export interface RepositoryEventsMap<T> {
  [RepositoryEvents.EntityUpdated]: T;
  [RepositoryEvents.EntitiesCreated]: T[];
}

export abstract class Repository<
  DbModel extends BaseModel,
  Model extends BaseModel = DbModel
> implements BaseRepository<DbModel, Model> {
  readonly events = new EventEmitter<RepositoryEventsMap<Model>>();

  constructor(
    protected readonly connection: Knex,
    private readonly table: Tables
  ) {}

  protected getQueryBuilder(): QueryBuilder {
    return this.connection(this.table);
  }

  protected abstract fromDb(entity: DbModel): Model;
  protected abstract toDb(entity: Model): DbModel;

  async transaction<T>(callback: (repository: this) => Promise<T>): Promise<T> {
    const trx = await this.connection.transaction();

    try {
      const repository = new (this as any).constructor(trx, this.table);
      repository.events = this.events;

      const result = await callback(repository);

      await trx.commit();

      return result;
    } catch (e) {
      await trx.rollback(e);

      throw e;
    }
  }

  async delete(ids: string[]): Promise<number> {
    return this.getQueryBuilder().delete().whereIn('id', ids);
  }

  async findMany(ids: string[]): Promise<Model[]> {
    const items = (await this.getQueryBuilder().whereIn(
      'id',
      ids
    )) as DbModel[];

    return items.map((item) => this.fromDb(item));
  }

  async findOne(id: string): Promise<Model | null> {
    const item = (await this.getQueryBuilder()
      .where('id', id)
      .first()) as DbModel | null;

    return item ? this.fromDb(item) : null;
  }

  async insert(entity: Model | Model[]): Promise<boolean> {
    const asArray = castAsArray(entity);
    const entities = asArray.map((entity) => {
      (entity as Model).createdAt = new Date();

      return this.toDb(entity as Model);
    }) as DbModel[];

    const result = await this.getQueryBuilder().insert(entities);

    await this.events.emit(RepositoryEvents.EntityUpdated, asArray as any);

    return Boolean(result);
  }

  async update(entity: Model): Promise<Model> {
    const updatedEntity = {
      ...entity,
      updatedAt: new Date(),
    };

    const result = await this.getQueryBuilder()
      .where('id', entity.id)
      .update(this.toDb(entity));

    if (result) {
      await this.events.emit(RepositoryEvents.EntityUpdated, updatedEntity);
    }

    return updatedEntity;
  }

  async updateMany(entities: Model[]): Promise<Model[]> {
    const mappedEntities = entities.map((entity) => ({
      ...entity,
      updatedAt: new Date(),
    }));

    await this.connection.transaction(async (t) => {
      const connection = t(this.table);

      await Promise.all(
        mappedEntities.map(async (entity) =>
          connection.clone().where('id', entity.id).update(this.toDb(entity))
        )
      );

      return t.commit();
    });

    await Promise.all(
      mappedEntities.map((entity) =>
        this.events.emit(RepositoryEvents.EntityUpdated, entity)
      )
    );

    return mappedEntities;
  }
}
