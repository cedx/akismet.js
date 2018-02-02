path: blob/master/lib
source: client.js

# Submit ham
This call is intended for the submission of false positives - items that were incorrectly classified as spam by Akismet. It takes identical arguments as [comment check](comment_check.md) and [submit spam](submit_spam.md).

Remember that, as explained in the [submit spam](submit_spam.md) documentation, you should ensure that any values you're passing here match up with the original and corresponding [comment check](comment_check.md) call.

```
Client#submitHam(comment: Comment): Promise
```

## Example
