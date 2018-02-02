'use strict';

const {expect} = require('chai');
const {URL} = require('url');
const {Author} = require('../lib/index.js');

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
      expect(author.ipAddress).to.be.empty;
      expect(author.userAgent).to.be.empty;
    });

    it('should return an initialized instance with a non-empty map', () => {
      let author = Author.fromJson({
        comment_author_email: 'cedric@belin.io',
        comment_author_url: 'https://belin.io',
        user_agent: 'Mozilla/5.0',
        user_ip: '127.0.0.1'
      });

      expect(author.email).to.equal('cedric@belin.io');
      expect(author.ipAddress).to.equal('127.0.0.1');
      expect(author.url).to.be.instanceof(URL).and.have.property('href').that.equal('https://belin.io/');
      expect(author.userAgent).to.equal('Mozilla/5.0');
    });
  });

  /**
   * @test {Author#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return only the IP address and user agent with a newly created instance', () => {
      let data = new Author('127.0.0.1', 'Doom/6.6.6').toJSON();
      expect(Object.keys(data)).to.have.lengthOf(2);
      expect(data.user_agent).to.equal('Doom/6.6.6');
      expect(data.user_ip).to.equal('127.0.0.1');
    });

    it('should return a non-empty map with an initialized instance', () => {
      let data = new Author('192.168.0.1', 'Mozilla/5.0', {email: 'cedric@belin.io', name: 'Cédric Belin', url: 'https://belin.io'}).toJSON();
      expect(Object.keys(data)).to.have.lengthOf(5);
      expect(data.comment_author).to.equal('Cédric Belin');
      expect(data.comment_author_email).to.equal('cedric@belin.io');
      expect(data.comment_author_url).to.equal('https://belin.io/');
      expect(data.user_agent).to.equal('Mozilla/5.0');
      expect(data.user_ip).to.equal('192.168.0.1');
    });
  });

  /**
   * @test {Author#toString}
   */
  describe('#toString()', () => {
    let data = String(new Author('127.0.0.1', 'Doom/6.6.6', {email: 'cedric@belin.io', name: 'Cédric Belin', url: 'https://belin.io'}));

    it('should start with the class name', () => {
      expect(data.startsWith('Author {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"comment_author":"Cédric Belin"')
        .and.contain('"comment_author_email":"cedric@belin.io"')
        .and.contain('"comment_author_url":"https://belin.io/"')
        .and.contain('"user_agent":"Doom/6.6.6"')
        .and.contain('"user_ip":"127.0.0.1"');
    });
  });
});
