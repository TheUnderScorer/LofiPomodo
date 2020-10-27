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

  protected getConnection(): QueryBuilder {
    return this.connection(this.table);
  }

  async delete(ids: string[]): Promise<number> {
    return this.getConnection().delete().whereIn('id', ids);
  }

  async findMany(ids: string[]): Promise<T[]> {
    return this.getConnection().whereIn('id', ids);
  }

  async findOne(id: string): Promise<T> {
    return this.getConnection().where('id', id).first();
  }

  async insert(entity: T | T[]): Promise<boolean> {
    const result = await this.getConnection().insert(entity);

    return Boolean(result);
  }

  async update(entity: T): Promise<boolean> {
    const result = await this.getConnection()
      .where('id', entity.id)
      .update({
        ...entity,
        updatedAt: new Date(),
      });

    return Boolean(result);
  }
}
