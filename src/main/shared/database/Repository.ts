import {
  BaseModel,
  BaseRepository,
  Tables,
} from '../../../shared/types/database';
import Knex, { QueryBuilder } from 'knex';

export class Repository<T extends BaseModel> implements BaseRepository<T> {
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
    const result = await this.getQueryBuilder().insert(entity);

    return Boolean(result);
  }

  async update(entity: T): Promise<boolean> {
    const result = await this.getQueryBuilder()
      .where('id', entity.id)
      .update({
        ...entity,
        updatedAt: new Date(),
      });

    return Boolean(result);
  }
}
