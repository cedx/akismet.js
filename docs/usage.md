# Usage

## Features
There are three different types of calls to Akismet:

1. [Key verification](features/key_verification.md) will verify whether or not a valid API key is being used. This is especially useful if you will have multiple users with their own Akismet subscriptions using your application.
2. [Comment check](features/comment_check.md) is used to ask Akismet whether or not a given post, comment, profile, etc. is spam.
3. [Submit spam](features/submit_spam.md) and [submit ham](features/submit_ham.md) are follow-ups to let Akismet know when it got something wrong (missed spam and false positives). These are very important, and you shouldn't develop using the Akismet API without a facility to include reporting missed spam and false positives.

See the detailed documentation of each feature for more information about their usage.

## Further reading
Before integrating this library into your application, you should [test your API calls](advanced/testing.md) to ensure a proper usage.

If you want to be notified when a call is made to the Akismet service, or to log the service responses for further processing, you should take a look at the [events triggered by the client](advanced/events.md).
