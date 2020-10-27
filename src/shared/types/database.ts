export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Tables {
  Tasks = 'tasks',
}

export interface BaseRepository<T extends BaseModel> {
  findOne: (id: string) => Promise<T>;
  findMany: (ids: string[]) => Promise<T[]>;
  delete: (ids: string[]) => Promise<number>;
  insert: (entity: T) => Promise<boolean>;
  update: (entity: T) => Promise<boolean>;
}
