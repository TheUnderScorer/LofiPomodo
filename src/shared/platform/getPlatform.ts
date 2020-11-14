export type Platforms = typeof process.platform;

export const getPlatform = (): NodeJS.Platform =>
  typeof process !== 'undefined' ? process.platform : window.platform;
