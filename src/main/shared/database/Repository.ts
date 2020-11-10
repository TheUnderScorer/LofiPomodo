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

export class Repository<T extends BaseModel> implements BaseRepository<T> {
  readonly events = new EventEmitter<RepositoryEventsMap<T>>();

  constructor(
    private readonly connection: Knex,
    private readonly table: Tables
  ) {}

  protected getQueryBuilder(): QueryBuilder {
    return this.connection(this.table);
  }

  async delete(ids: string[]): Promise<number> {
    return this.getQueryBuilder().delete().whereIn('id', ids);
  }

  async findMany(ids: string[]): Promise<T[]> {
    return this.getQueryBuilder().whereIn('id', ids);
  }

  async findOne(id: string): Promise<T> {
    return this.getQueryBuilder().where('id', id).first();
  }

  async insert(entity: T | T[]): Promise<boolean> {
    const entities = castAsArray(entity).map((entity) => {
      (entity as T).createdAt = new Date();

      return entity;
    }) as T[];

    const result = await this.getQueryBuilder().insert(entities);

    await this.events.emit(RepositoryEvents.EntityUpdated, entities as any);

    return Boolean(result);
  }

  async update(entity: T): Promise<boolean> {
    const result = await this.getQueryBuilder()
      .where('id', entity.id)
      .update({
        ...entity,
        updatedAt: new Date(),
      });

    if (result) {
      await this.events.emit(RepositoryEvents.EntityUpdated, entity);
    }

    return Boolean(result);
  }

  async updateMany(entities: T[]) {
    const mappedEntities = entities.map((entity) => ({
      ...entity,
      updatedAt: new Date(),
    }));

    await this.connection.transaction(async (t) => {
      const connection = t(this.table);

      await Promise.all(
        mappedEntities.map(async (entity) =>
          connection.clone().where('id', entity.id).update(entity)
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
