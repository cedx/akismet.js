import {strict as assert} from 'assert';
import {Blog} from '../lib/index.js';

/** Tests the features of the {@link Blog} class. */
describe('Blog', () => {
  describe('.fromJson()', () => {
    it('should return an empty instance with an empty map', () => {
      const blog = Blog.fromJson({});
      assert.equal(blog.charset.length, 0);
      assert.equal(blog.languages.length, 0);
      assert.equal(blog.url, undefined);
    });

    it('should return an initialized instance with a non-empty map', () => {
      const blog = Blog.fromJson({
        blog: 'https://dev.belin.io/akismet.js',
        blog_charset: 'UTF-8',
        blog_lang: 'en, fr'
      });

      assert.equal(blog.charset, 'UTF-8');
      assert.deepEqual(blog.languages, ['en', 'fr']);
      assert(blog.url instanceof URL);
      assert.equal(blog.url.href, 'https://dev.belin.io/akismet.js');
    });
  });

  describe('.toJSON()', () => {
    it('should return only the blog URL with a newly created instance', () => {
      const data = new Blog(new URL('https://dev.belin.io/akismet.js')).toJSON();
      assert.equal(Object.keys(data).length, 1);
      assert.equal(data.blog, 'https://dev.belin.io/akismet.js');
    });

    it('should return a non-empty map with an initialized instance', () => {
      const data = new Blog(new URL('https://dev.belin.io/akismet.js'), {charset: 'UTF-8', languages: ['en', 'fr']}).toJSON();
      assert.equal(Object.keys(data).length, 3);
      assert.equal(data.blog, 'https://dev.belin.io/akismet.js');
      assert.equal(data.blog_charset, 'UTF-8');
      assert.equal(data.blog_lang, 'en,fr');
    });
  });
});
