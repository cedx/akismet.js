import { JsonObject } from './json';
/** Represents the front page or home URL transmitted when making requests. */
export declare class Blog {
    url?: URL | undefined;
    /** The character encoding for the values included in comments. */
    charset: string;
    /** The languages in use on the blog or site, in ISO 639-1 format. */
    languages: string[];
    /**
     * Creates a new blog.
     * @param url The blog or site URL.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(url?: URL | undefined, options?: Partial<BlogOptions>);
    /**
     * Creates a new blog from the specified JSON object.
     * @param map A JSON object representing a blog.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map: JsonObject): Blog;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}
/** Defines the options of a [[Blog]] instance. */
export interface BlogOptions {
    /** The character encoding for the values included in comments. */
    charset: string;
    /** The languages in use on the blog or site, in ISO 639-1 format. */
    languages: string[];
}
