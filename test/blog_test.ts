/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Blog} from '../src';

/**
 * Tests the features of the `Client` class.
 */
@suite class BlogTest {

  /**
   * Tests the `Blog.fromJson()` method.
   */
  @test testFromJson(): void {
    // It should return an empty instance with an empty map.
    let blog = Blog.fromJson({});
    expect(blog.charset).to.be.empty;
    expect(blog.languages).to.be.an('array').that.is.empty;
    expect(blog.url).to.be.null;

    // It should return an initialized instance with a non-empty map.
    blog = Blog.fromJson({
      blog: 'https://dev.belin.io/akismet.js',
      blog_charset: 'UTF-8',
      blog_lang: 'en, fr'
    });

    expect(blog.charset).to.equal('UTF-8');
    expect(blog.languages).to.have.ordered.members(['en', 'fr']);
    expect(blog.url).to.be.an.instanceof(URL).and.have.property('href').that.equal('https://dev.belin.io/akismet.js');
  }

  /**
   * Tests the `Blog#toJSON()` method.
   */
  @test testToJSON(): void {
    // It should return only the blog URL with a newly created instance.
    let data = new Blog(new URL('https://dev.belin.io/akismet.js')).toJSON();
    expect(Object.keys(data)).to.have.lengthOf(1);
    expect(data.blog).to.equal('https://dev.belin.io/akismet.js');

    // It should return a non-empty map with an initialized instance.
    data = new Blog(new URL('https://dev.belin.io/akismet.js'), {charset: 'UTF-8', languages: ['en', 'fr']}).toJSON();
    expect(Object.keys(data)).to.have.lengthOf(3);
    expect(data.blog).to.equal('https://dev.belin.io/akismet.js');
    expect(data.blog_charset).to.equal('UTF-8');
    expect(data.blog_lang).to.equal('en,fr');
  }

  /**
   * Tests the `Blog#toString()` method.
   */
  @test testToString(): void {
    const data = String(new Blog(new URL('https://dev.belin.io/akismet.js'), {charset: 'UTF-8', languages: ['en', 'fr']}));

    // It should start with the class name.
    expect(data.startsWith('Blog {')).be.true;

    // It should contain the instance properties.
    expect(data).to.contain('"blog":"https://dev.belin.io/akismet.js"')
      .and.contain('"blog_charset":"UTF-8"')
      .and.contain('"blog_lang":"en,fr"');
  }
}
