/** Defines the shape of a JSON value. */
export declare type Json = null | boolean | number | string | Json[] | {
    [property: string]: Json;
};
/** Defines the shape of an object in JSON format. */
export declare type JsonObject = Record<string, Json>;
