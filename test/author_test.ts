/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Author} from '../src';

/**
 * Tests the features of the `Client` class.
 */
@suite class AuthorTest {

  /**
   * Tests the `Author.fromJson()` method.
   */
  @test testFromJson(): void {
    // It should return an empty instance with an empty map.
    let author = Author.fromJson({});
    expect(author.email).to.be.empty;
    expect(author.ipAddress).to.be.empty;
    expect(author.userAgent).to.be.empty;

    // It should return an initialized instance with a non-empty map.
    author = Author.fromJson({
      comment_author_email: 'cedric@belin.io',
      comment_author_url: 'https://belin.io',
      user_agent: 'Mozilla/5.0',
      user_ip: '127.0.0.1'
    });

    expect(author.email).to.equal('cedric@belin.io');
    expect(author.ipAddress).to.equal('127.0.0.1');
    expect(author.url).to.be.an.instanceof(URL).and.have.property('href').that.equal('https://belin.io/');
    expect(author.userAgent).to.equal('Mozilla/5.0');
  }

  /**
   * Tests the `Author#toJSON()` method.
   */
  @test testToJSON(): void {
    // It should return only the IP address and user agent with a newly created instance.
    let data = new Author('127.0.0.1', 'Doom/6.6.6').toJSON();
    expect(Object.keys(data)).to.have.lengthOf(2);
    expect(data.user_agent).to.equal('Doom/6.6.6');
    expect(data.user_ip).to.equal('127.0.0.1');

    // It should return a non-empty map with an initialized instance.
    data = new Author('192.168.0.1', 'Mozilla/5.0', {email: 'cedric@belin.io', name: 'Cédric Belin', url: new URL('https://belin.io')}).toJSON();
    expect(Object.keys(data)).to.have.lengthOf(5);
    expect(data.comment_author).to.equal('Cédric Belin');
    expect(data.comment_author_email).to.equal('cedric@belin.io');
    expect(data.comment_author_url).to.equal('https://belin.io/');
    expect(data.user_agent).to.equal('Mozilla/5.0');
    expect(data.user_ip).to.equal('192.168.0.1');
  }

  /**
   * Tests the `Author#toString()` method.
   */
  @test testToString(): void {
    const data = String(new Author('127.0.0.1', 'Doom/6.6.6', {email: 'cedric@belin.io', name: 'Cédric Belin', url: new URL('https://belin.io')}));

    // It should start with the class name.
    expect(data.startsWith('Author {')).to.be.true;

    // It should contain the instance properties.
    expect(data).to.contain('"comment_author":"Cédric Belin"')
      .and.contain('"comment_author_email":"cedric@belin.io"')
      .and.contain('"comment_author_url":"https://belin.io/"')
      .and.contain('"user_agent":"Doom/6.6.6"')
      .and.contain('"user_ip":"127.0.0.1"');
  }
}
