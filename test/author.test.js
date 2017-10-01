'use strict';

const {expect} = require('chai');
const {URL} = require('url');
const {Author} = require('../lib');

/**
 * @test {Author}
 */
describe('Author', () => {

  /**
   * @test {Author.fromJson}
   */
  describe('.fromJson()', () => {
    it('should return a null reference with a non-object value', () => {
      expect(Author.fromJson('foo')).to.be.null;
    });

    it('should return an empty instance with an empty map', () => {
      let author = Author.fromJson({});
      expect(author.email).to.be.empty;
      expect(author.url).to.be.null;
    });

    it('should return an initialized instance with a non-empty map', () => {
      let author = Author.fromJson({
        comment_author_email: 'cedric@belin.io',
        comment_author_url: 'https://belin.io'
      });

      expect(author.email).to.equal('cedric@belin.io');
      expect(author.url).to.be.instanceof(URL).and.have.property('href').that.equal('https://belin.io/');
    });
  });

  /**
   * @test {Author#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return an empty map with a newly created instance', () => {
      expect((new Author).toJSON()).to.be.an('object').that.is.empty;
    });

    it('should return a non-empty map with an initialized instance', () => {
      let author = new Author('127.0.0.1');
      author.email = 'cedric@belin.io';
      author.name = 'Cédric Belin';
      author.url = new URL('https://belin.io');

      let data = author.toJSON();
      expect(data.comment_author).to.equal('Cédric Belin');
      expect(data.comment_author_email).to.equal('cedric@belin.io');
      expect(data.comment_author_url).to.equal('https://belin.io/');
      expect(data.user_ip).to.equal('127.0.0.1');
    });
  });

  /**
   * @test {Author#toString}
   */
  describe('#toString()', () => {
    let author = new Author('127.0.0.1');
    author.email = 'cedric@belin.io';
    author.name = 'Cédric Belin';
    author.url = new URL('https://belin.io');

    let data = String(author);
    it('should start with the class name', () => {
      expect(data.startsWith('Author {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"comment_author":"Cédric Belin"')
        .and.contain('"comment_author_email":"cedric@belin.io"')
        .and.contain('"comment_author_url":"https://belin.io/"')
        .and.contain('"user_ip":"127.0.0.1"');
    });
  });
});