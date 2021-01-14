import {
  BaseModel,
  BaseRepository,
  Tables,
} from '../../../shared/types/database';
import Knex, { QueryBuilder } from 'knex';
import { castAsArray } from '../../../shared/utils/array';
import { Typed as EventEmitter } from 'emittery';
import { EntityNotFound } from './errors/EntityNotFound';
import { mapToId } from '../../../shared/mappers/mapToId';
import { EntitiesNotFound } from './errors/EntitiesNotFound';

export enum RepositoryEvents {
  EntityUpdated = 'EntityUpdated',
  EntitiesCreated = 'EntitiesCreated',
  EntitiesDeleted = 'EntitiesDeleted',
}

export interface EntityUpdatedPayload<T> {
  prevEntity: T;
  entity: T;
}

export interface RepositoryEventsMap<T> {
  [RepositoryEvents.EntityUpdated]: EntityUpdatedPayload<T>;
  [RepositoryEvents.EntitiesCreated]: T[];
  [RepositoryEvents.EntitiesDeleted]: T[];
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

  async delete(idOrIds: string | string[]): Promise<number> {
    const ids = castAsArray(idOrIds) as string[];
    const records = await this.findMany(ids);

    const result = await this.getQueryBuilder().delete().whereIn('id', ids);

    await this.events.emit(RepositoryEvents.EntitiesDeleted, records);

    return result;
  }

  async findMany(ids: string[]): Promise<Model[]> {
    const items = (await this.getQueryBuilder().whereIn(
      'id',
      ids
    )) as DbModel[];

    return items.map((item) => this.fromDb(item));
  }

  async getMany(ids: string[]): Promise<Model[]> {
    const result = await this.findMany(ids);

    if (result.length !== ids.length) {
      const missingIds = ids.filter(
        (id) => !result.find((entity) => entity.id === id)
      );

      throw new EntitiesNotFound(missingIds);
    }

    return result;
  }

  async findOne(id: string): Promise<Model | null> {
    const item = (await this.getQueryBuilder()
      .where('id', id)
      .first()) as DbModel | null;

    return item ? this.fromDb(item) : null;
  }

  async getOne(id: string): Promise<Model> {
    const result = await this.findOne(id);

    if (!result) {
      throw new EntityNotFound(id);
    }

    return result;
  }

  async insert(entity: Model | Model[]): Promise<boolean> {
    const entitiesArray = castAsArray(entity) as Model[];
    const mappedEntities = entitiesArray.map((entity) => {
      (entity as Model).createdAt = new Date();

      return this.toDb(entity as Model);
    }) as DbModel[];

    const result = await this.getQueryBuilder().insert(mappedEntities);

    await this.events.emit(RepositoryEvents.EntitiesCreated, entitiesArray);

    return Boolean(result);
  }

  async update(entity: Model, prevEntityProvided?: Model): Promise<Model> {
    const updatedEntity = {
      ...entity,
      updatedAt: new Date(),
    };

    const prevEntity = prevEntityProvided ?? (await this.getOne(entity.id));

    const result = await this.getQueryBuilder()
      .where('id', entity.id)
      .update(this.toDb(entity));

    if (result) {
      await this.events.emit(RepositoryEvents.EntityUpdated, {
        entity: updatedEntity,
        prevEntity,
      });
    }

    return updatedEntity;
  }

  async updateMany(entities: Model[]): Promise<Model[]> {
    const mappedEntities = entities.map((entity) => ({
      ...entity,
      updatedAt: new Date(),
    }));

    const prevEntities = await this.getMany(mapToId(entities));

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
      mappedEntities.map((entity) => {
        const prevEntity = prevEntities.find(({ id }) => entity.id === id);

        return this.events.emit(RepositoryEvents.EntityUpdated, {
          prevEntity: prevEntity!,
          entity,
        });
      })
    );

    return mappedEntities;
  }
}
