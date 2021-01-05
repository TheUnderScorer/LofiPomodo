import { name } from '../../../../package.json';

export const getAppProtocol = (path: string = '') => `${name}://${path}`;
