import { BaseModel } from '../types/database';

export const getById = <T extends BaseModel>(arr: T[], id: string) => {
  return arr.find((item) => item.id === id);
};
