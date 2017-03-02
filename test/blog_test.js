'use strict';

import {expect} from 'chai';
import {Blog} from '../src/index';

/**
 * @test {Blog}
 */
describe('Blog', () => {

  /**
   * @test {Blog.fromJSON}
   */
  describe('.fromJSON()', () => {
    it('should return a null reference with a non-object value', () => {
      expect(Blog.fromJSON('foo')).to.be.null;
    });

    it('should return an empty instance with an empty map', () => {
      let blog = Blog.fromJSON({});
      expect(blog.charset).to.be.empty;
      expect(blog.languages).to.be.empty;
      expect(blog.url).to.be.empty;
    });

    it('should return an initialized instance with a non-empty map', () => {
      let blog = Blog.fromJSON({
        blog: 'https://github.com/cedx/akismet.js',
        blog_charset: 'UTF-8',
        blog_lang: 'en, fr'
      });

      expect(blog.charset).to.equal('UTF-8');
      expect(blog.languages).to.have.lengthOf(2);
      expect(blog.languages[0]).to.equal('en');
      expect(blog.languages[1]).to.equal('fr');
      expect(blog.url).to.equal('https://github.com/cedx/akismet.js');
    });
  });

  /**
   * @test {Blog#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return an empty map with a newly created instance', () => {
      expect(new Blog().toJSON()).to.be.empty;
    });

    it('should return a non-empty map with a initialized instance', () => {
      let data = new Blog('https://github.com/cedx/akismet.js', 'UTF-8', ['en', 'fr']).toJSON();
      expect(Object.keys(data)).to.have.lengthOf(3);
      expect(data.blog).to.equal('https://github.com/cedx/akismet.js');
      expect(data.blog_charset).to.equal('UTF-8');
      expect(data.blog_lang).to.equal('en,fr');
    });
  });

  /**
   * @test {Blog#toString}
   */
  describe('#toString()', () => {
    let data = String(new Blog('https://github.com/cedx/akismet.js', 'UTF-8', ['en', 'fr']));

    it('should start with the class name', () => {
      expect(data.indexOf('Blog {')).to.equal(0);
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"blog":"https://github.com/cedx/akismet.js"')
        .and.contain('"blog_charset":"UTF-8"')
        .and.contain('"blog_lang":"en,fr"');
    });
  });
});
