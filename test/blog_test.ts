/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Blog} from '../src';

/**
 * Tests the `Blog}
 */
describe('Blog', () => {

  /**
   * Tests the `Blog.fromJson}
   */
  describe('.fromJson()', () => {
    it('should return a null reference with a non-object value', () => {
      expect(Blog.fromJson('foo')).to.be.null;
    });

    it('should return an empty instance with an empty map', () => {
      let blog = Blog.fromJson({});
      expect(blog.charset).to.be.empty;
      expect(blog.languages).to.be.an('array').that.is.empty;
      expect(blog.url).to.be.null;
    });

    it('should return an initialized instance with a non-empty map', () => {
      let blog = Blog.fromJson({
        blog: 'https://dev.belin.io/akismet.js',
        blog_charset: 'UTF-8',
        blog_lang: 'en, fr'
      });

      expect(blog.charset).to.equal('UTF-8');
      expect(blog.languages).to.have.ordered.members(['en', 'fr']);
      expect(blog.url).to.be.instanceof(URL).and.have.property('href').that.equal('https://dev.belin.io/akismet.js');
    });
  });

  /**
   * Tests the `Blog#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return only the blog URL with a newly created instance', () => {
      let data = new Blog('https://dev.belin.io/akismet.js').toJSON();
      expect(Object.keys(data)).to.have.lengthOf(1);
      expect(data.blog).to.equal('https://dev.belin.io/akismet.js');
    });

    it('should return a non-empty map with an initialized instance', () => {
      let data = new Blog('https://dev.belin.io/akismet.js', {charset: 'UTF-8', languages: ['en', 'fr']}).toJSON();
      expect(Object.keys(data)).to.have.lengthOf(3);
      expect(data.blog).to.equal('https://dev.belin.io/akismet.js');
      expect(data.blog_charset).to.equal('UTF-8');
      expect(data.blog_lang).to.equal('en,fr');
    });
  });

  /**
   * Tests the `Blog#toString}
   */
  describe('#toString()', () => {
    let data = String(new Blog('https://dev.belin.io/akismet.js', {charset: 'UTF-8', languages: ['en', 'fr']}));

    it('should start with the class name', () => {
      expect(data.startsWith('Blog {')).be.true;
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"blog":"https://dev.belin.io/akismet.js"')
        .and.contain('"blog_charset":"UTF-8"')
        .and.contain('"blog_lang":"en,fr"');
    });
  });
});
