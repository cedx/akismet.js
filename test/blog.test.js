'use strict';

import assert from 'assert';
import {Blog} from '../src/index';

/**
 * @test {Blog}
 */
describe('Blog', () => {

  /**
   * @test {Blog#constructor}
   */
  describe('#constructor()', () => {
    it('should initialize the existing properties', () => {
      let blog = new Blog({charset: 'UTF-8', language: 'en', url: 'https://github.com/cedx/akismet.js'});
      assert.equal(blog.charset, 'UTF-8');
      assert.equal(blog.language, 'en');
      assert.equal(blog.url, 'https://github.com/cedx/akismet.js');
    });

    it('should not create new properties', () => {
      assert.ok(!('foo' in new Blog({foo: 'bar'})));
    });
  });

  /**
   * @test {Blog.fromJSON}
   */
  describe('.fromJSON()', () => {
    it('should return a null reference with a non-object JSON string', () => {
      assert.strictEqual(Blog.fromJSON('foo'), null);
    });

    it('should return an empty instance with an empty JSON object', () => {
      let blog = Blog.fromJSON({});
      assert.equal(blog.charset.length, 0);
      assert.equal(blog.language.length, 0);
      assert.equal(blog.url.length, 0);
    });

    it('should return an initialized instance with a non-empty JSON object', () => {
      let blog = Blog.fromJSON({
        blog: 'https://github.com/cedx/akismet.js',
        blog_charset: 'UTF-8',
        blog_lang: 'en'
      });

      assert.equal(blog.charset, 'UTF-8');
      assert.equal(blog.language, 'en');
      assert.equal(blog.url, 'https://github.com/cedx/akismet.js');
    });
  });

  /**
   * @test {Blog#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return an empty JSON object with a newly created instance', () => {
      assert.equal(Object.keys(new Blog().toJSON()).length, 0);
    });

    it('should return a non-empty JSON object with a initialized instance', () => {
      let data = new Blog({
        charset: 'UTF-8',
        language: 'en',
        url: 'https://github.com/cedx/akismet.js'
      }).toJSON();

      assert.equal(data.blog, 'https://github.com/cedx/akismet.js');
      assert.equal(data.blog_charset, 'UTF-8');
      assert.equal(data.blog_lang, 'en');
    });
  });
});
