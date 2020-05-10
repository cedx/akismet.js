/** Represents the author of a comment. */
export class Author {
    /**
     * Creates a new author.
     * @param ipAddress The author's IP address.
     * @param userAgent The author's user agent, that is the string identifying the Web browser used to submit comments.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(ipAddress, userAgent, options = {}) {
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        const { email = '', name = '', role = '', url } = options;
        this.email = email;
        this.name = name;
        this.role = role;
        this.url = url;
    }
    /**
     * Creates a new author from the specified JSON object.
     * @param map A JSON object representing an author.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map) {
        return new Author(typeof map.user_ip == 'string' ? map.user_ip : '', typeof map.user_agent == 'string' ? map.user_agent : '', {
            email: typeof map.comment_author_email == 'string' ? map.comment_author_email : '',
            name: typeof map.comment_author == 'string' ? map.comment_author : '',
            role: typeof map.user_role == 'string' ? map.user_role : '',
            url: typeof map.comment_author_url == 'string' ? new URL(map.comment_author_url) : undefined
        });
    }
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON() {
        const map = { user_agent: this.userAgent, user_ip: this.ipAddress };
        if (this.name.length)
            map.comment_author = this.name;
        if (this.email.length)
            map.comment_author_email = this.email;
        if (this.url)
            map.comment_author_url = this.url.href;
        if (this.role.length)
            map.user_role = this.role;
        return map;
    }
}
