export interface BaseModel {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface Pagination {
  take: number;
  skip: number;
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type Order<T extends Record<string, any>> = {
  [Key in keyof T]?: T[Key] extends object
    ? Order<T[Key]>
    : T[Key] extends Array<infer P>
    ? Order<P>
    : OrderDirection;
};
