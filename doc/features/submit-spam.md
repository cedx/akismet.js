path: blob/master
source: lib/client.js

# Submit spam
This call is for submitting comments that weren't marked as spam but should have been.

It is very important that the values you submit with this call match those of your [comment check](comment-check.md) calls as closely as possible. In order to learn from its mistakes, Akismet needs to match your missed spam and false positive reports to the original [comment check](comment-check.md) API calls made when the content was first posted. While it is normal for less information to be available for [submit spam](submit-spam.md) and [submit ham](submit-ham.md) calls (most comment systems and forums will not store all metadata), you should ensure that the values that you do send match those of the original content.

```javascript
async Client#submitSpam(comment)
```

## Example
