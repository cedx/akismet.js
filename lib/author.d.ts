import { JsonObject } from './json';
/** Represents the author of a comment. */
export declare class Author {
    ipAddress: string;
    userAgent: string;
    /** The author's mail address. If you set it to `"akismet-guaranteed-spam@example.com"`, Akismet will always return `true`. */
    email: string;
    /** The author's name. If you set it to `"viagra-test-123"`, Akismet will always return `true`. */
    name: string;
    /** The role of the author. If you set it to `"administrator"`, Akismet will always return `false`. */
    role: string;
    /** The URL of the author's website. */
    url?: URL;
    /**
     * Creates a new author.
     * @param ipAddress The author's IP address.
     * @param userAgent The author's user agent, that is the string identifying the Web browser used to submit comments.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(ipAddress: string, userAgent: string, options?: Partial<AuthorOptions>);
    /**
     * Creates a new author from the specified JSON object.
     * @param map A JSON object representing an author.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map: JsonObject): Author;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}
/** Defines the options of an [[Author]] instance. */
export interface AuthorOptions {
    /** The author's mail address. */
    email: string;
    /** The author's name. */
    name: string;
    /** The role of the author. */
    role: string;
    /** The URL of the author's website. */
    url: URL;
}
