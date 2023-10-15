declare type Unfold<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

declare type Unfolds<T> = T extends object ?
  T extends infer O ?
  { [K in keyof O]: Unfold<O[K]> } : never : T;

declare type ObjIndex<T = any> = Record<string, T>;