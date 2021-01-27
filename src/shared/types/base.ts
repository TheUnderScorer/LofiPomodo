export interface ToString {
  toString: () => string;
}

export type Nullable<T> = T | null;

export type OmitUnderscored<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K]
}

export type PrefixProperties<T extends Record<string, any>, Prefix extends string> = {
  [Key in keyof T & string as `${Prefix}${Key}`]: T[Key];
}

