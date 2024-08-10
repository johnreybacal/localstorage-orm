import Schema, { SchemaFunctions } from "./schema";

export type Filter<T extends Schema> = Partial<Omit<T, keyof SchemaFunctions>>;
export type Record<T extends Schema> = Omit<T, keyof Schema>;
export type PartialRecord<T extends Schema> = Partial<Omit<T, keyof Schema>>;
