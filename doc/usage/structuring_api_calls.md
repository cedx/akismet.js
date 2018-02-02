# Structuring your API calls
There are three different types of calls to Akismet:

1. [Key verification](../features/key_verification.md) will verify whether or not a valid API key is being used. This is especially useful if you will have multiple users with their own Akismet subscriptions using your application.
2. [Comment check](../features/comment_check.md) is used to ask Akismet whether or not a given post, comment, profile, etc. is spam.
3. [Submit spam](../features/submit_spam.md) and [submit ham](../features/submit_ham.md) are follow-ups to let Akismet know when it got something wrong (missed spam and false positives). These are very important, and you shouldn't develop using the Akismet API without a facility to include reporting missed spam and false positives.

## Setting up the client


## Checking comments

## Setting your user agent
If possible, your user agent string should always use the following format:

```
Application Name/Version | Plugin Name/Version
```

!!! info
    The default user agent string looks like:
    `Dart/1.24.3 | Akismet/4.0.0`
