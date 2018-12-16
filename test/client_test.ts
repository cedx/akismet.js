/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test, timeout} from 'mocha-typescript';
import {Author, Blog, Client, Comment, CommentType} from '../src';

/**
 * Tests the features of the `Client` class.
 */
@suite(timeout(15000))
class ClientTest {

  /**
   * The default test client.
   */
  private _client: Client = new Client(process.env.AKISMET_API_KEY!, new Blog(new URL('https://dev.belin.io/akismet.js')), {isTest: true});

  /**
   * A message marked as ham.
   */
  private _ham: Comment = new Comment(
    new Author('192.168.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36', {
      name: 'Akismet',
      role: 'administrator',
      url: new URL('https://dev.belin.io/akismet.js')
    }), {
    content: 'I\'m testing out the Service API.',
    referrer: new URL('https://www.npmjs.com/package/@cedx/akismet'),
    type: CommentType.comment
  });

  /**
   * A message marked as spam.
   */
  private _spam: Comment = new Comment(
    new Author('127.0.0.1', 'Spam Bot/6.6.6', {
      email: 'akismet-guaranteed-spam@example.com',
      name: 'viagra-test-123'
    }), {
    content: 'Spam!',
    type: CommentType.trackback
  });

  /**
   * Tests the `Client#checkComment()` method.
   */
  @test async testCheckComment(): Promise<void> {
    // It should return `false` for valid comment (e.g. ham)' , async () => {
    expect(await this._client.checkComment(this._ham)).to.be.false;

    // It should return `true` for invalid comment (e.g. spam)' , async () => {
    expect(await this._client.checkComment(this._spam)).to.be.true;
  }

  /**
   * Tests the `Client#submitHam()` method.
   */
  @test async testSubmitHam(): Promise<void> {
    // It should complete without error' , async () => {
    await this._client.submitHam(this._ham);
    expect(true).to.be.ok;
  }

  /**
   * Tests the `Client#submitSpam()` method.
   */
  @test async testSubmitSpam(): Promise<void> {
    // It should complete without error' , async () => {
    await this._client.submitSpam(this._spam);
    expect(true).to.be.ok;
  }

  /**
   * Tests the `Client#verifyKey()` method.
   */
  @test async testVerifyKey(): Promise<void> {
    // It should return `true` for a valid API key' , async () => {
    expect(await this._client.verifyKey()).to.be.true;

    // It should return `false` for an invalid API key' , async () => {
    const client = new Client('0123456789-ABCDEF', this._client.blog, {isTest: this._client.isTest});
    expect(await client.verifyKey()).to.be.false;
  }
}
