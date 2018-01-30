path: blob/master
source: lib/client.js

# Submit ham
This call is intended for the submission of false positives - items that were incorrectly classified as spam by Akismet. It takes identical arguments as [comment check](comment-check.md) and [submit spam](submit-spam.md).

Remember that, as explained in the [submit spam](submit-spam.md) documentation, you should ensure that any values you're passing here match up with the original and corresponding [comment check](comment-check.md) call.

```javascript
async Client#submitHam(comment)
```

## Example
