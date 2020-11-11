export interface BaseModel {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Tables {
  Tasks = 'tasks',
}

export interface BaseRepository<
  DbModel extends BaseModel,
  Model extends BaseModel = DbModel
> {
  findOne: (id: string) => Promise<Model | null>;
  findMany: (ids: string[]) => Promise<Model[]>;
  delete: (ids: string[]) => Promise<number>;
  insert: (entity: Model | Model[]) => Promise<boolean>;
  update: (entity: Model) => Promise<Model>;
  updateMany: (entity: Model[]) => Promise<Model[]>;
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
