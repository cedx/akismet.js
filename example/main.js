/* eslint-disable no-unused-vars */
import {Author, Blog, Client, ClientError, Comment, CommentType} from '@cedx/akismet';

/**
 * Queries the Akismet service.
 * @return {Promise} Completes when the program is terminated.
 */
async function main() {
  try {
    // Key verification.
    const client = new Client('123YourAPIKey', new Blog(new URL('https://www.yourblog.com')));
    const isValid = await client.verifyKey();
    console.log(isValid ? 'The API key is valid' : 'The API key is invalid');

    // Comment check.
    const comment = new Comment(
      new Author('127.0.0.1', 'Mozilla/5.0'),
      {content: 'A user comment', type: CommentType.contactForm}
    );

    const isSpam = await client.checkComment(comment);
    console.log(isSpam ? 'The comment is spam' : 'The comment is ham');

    // Submit spam / ham.
    await client.submitSpam(comment);
    console.log('Spam submitted');

    await client.submitHam(comment);
    console.log('Ham submitted');
  }

  catch (error) {
    console.log(`An error occurred: ${error.message}`);
    if (error instanceof ClientError) console.log(`From: ${error.uri}`);
  }
}
