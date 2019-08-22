import * as chai from 'chai';
import {Blog} from '../lib/index';

/** Tests the features of the [[Blog]] class. */
describe('Blog', () => {
  const {expect} = chai;

  describe('.fromJson()', () => {
    it('should return an empty instance with an empty map', () => {
      const blog = Blog.fromJson({});
      expect(blog.charset).to.be.empty;
      expect(blog.languages).to.be.an('array').that.is.empty;
      expect(blog.url).to.be.null;
    });

    it('should return an initialized instance with a non-empty map', () => {
      const blog = Blog.fromJson({
        blog: 'https://dev.belin.io/akismet.js',
        blog_charset: 'UTF-8',
        blog_lang: 'en, fr'
      });

      expect(blog.charset).to.equal('UTF-8');
      expect(blog.languages).to.have.ordered.members(['en', 'fr']);
      expect(blog.url).to.be.an.instanceof(URL).and.have.property('href').that.equal('https://dev.belin.io/akismet.js');
    });
  });

  describe('#toJSON()', () => {
    it('should return only the blog URL with a newly created instance', () => {
      const data = new Blog(new URL('https://dev.belin.io/akismet.js')).toJSON();
      expect(Object.keys(data)).to.have.lengthOf(1);
      expect(data.blog).to.equal('https://dev.belin.io/akismet.js');
    });

    it('should return a non-empty map with an initialized instance', () => {
      const data = new Blog(new URL('https://dev.belin.io/akismet.js'), {charset: 'UTF-8', languages: ['en', 'fr']}).toJSON();
      expect(Object.keys(data)).to.have.lengthOf(3);
      expect(data.blog).to.equal('https://dev.belin.io/akismet.js');
      expect(data.blog_charset).to.equal('UTF-8');
      expect(data.blog_lang).to.equal('en,fr');
    });
  });
});
