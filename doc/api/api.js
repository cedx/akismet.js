YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Author",
        "Client",
        "Comment",
        "CommentType",
        "EndPoints"
    ],
    "modules": [
        "client",
        "comment"
    ],
    "allModules": [
        {
            "displayName": "client",
            "name": "client",
            "description": "Contains classes that provide a simple programming interface for querying [Akismet](https://akismet.com) service."
        },
        {
            "displayName": "comment",
            "name": "comment",
            "description": "Provides classes describing a comment."
        }
    ]
} };
});