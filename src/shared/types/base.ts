export interface ToString {
  toString: () => string;
}

export type Nullable<T> = T | null;

export type OmitUnderscored<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

export type PartialUnderscored<T> = {
  [K in keyof T as K]: K extends `_${string}` ? Partial<T[K]> : T[K];
};

export type PrefixProperties<
  T extends Record<string, any>,
  Prefix extends string
> = {
  [Key in keyof T & string as `${Prefix}${Key}`]: T[Key];
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type OmitFunctions<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]
>;

export interface Constructor<T> {
  new (...args: any[]): T;
}
