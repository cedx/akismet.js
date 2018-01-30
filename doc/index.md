# Akismet <small>for JS</small>
Use [Akismet](https://akismet.com)'s powerful spam detection within your [Node.js](https://nodejs.org) applications.

## Get a developer key
You first need to sign up for a developer key. This will give you access to the API and will allow Akismet to monitor its results to make sure things are running as smoothly as possible.

[> Get a developer key](https://akismet.com/signup/?connect=yes&plan=developer)

## Building your application

### Structuring your API calls
There are three different types of calls to Akismet:

1. [Key verification](features/key-verification.md) will verify whether or not a valid API key is being used. This is especially useful if you will have multiple users with their own Akismet subscriptions using your application.
2. [Comment check](features/comment-check.md) is used to ask Akismet whether or not a given post, comment, profile, etc. is spam.
3. [Submit spam](features/submit-spam.md) and [submit ham](features/submit-ham.md) are follow-ups to let Akismet know when it got something wrong (missed spam and false positives). These are very important, and you shouldn't develop using the Akismet API without a facility to include reporting missed spam and false positives.

### Testing your API calls
Akismet works by examining all the available information combined. It is not enough to provide just the content of a message; you need to provide as many independent pieces of information as you can in each call. So before you can test Akismet's accuracy, you need to make sure you're sending complete and correct information.
