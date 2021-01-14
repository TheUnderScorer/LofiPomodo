import { BaseModel } from '../types/database';

export const mapToId = <T extends BaseModel>(entities: T[]) =>
  entities.map((entity) => entity.id);
