/** Defines the shape of a JSON value. */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | {[property: string]: Json};

/** Defines the shape of an object in JSON format. */
export type JsonObject = Record<string, Json>;
