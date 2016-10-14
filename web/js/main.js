/**
 * Web interface.
 * @module web/main
 */

/**
 * Application entry point.
 */
$(() => {
  // Enable the tooltips.
  let isTouch = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints || navigator.msMaxTouchPoints;
  if (!isTouch) $('[data-toggle="tooltip"]').tooltip({placement: 'auto'});

  // Register the button handlers.
  $('#btn-submit').on('click', event => {
    event.preventDefault();

    // Validate the user input.
    $('#form-unit-tests input').each((index, element) => {
      let input = $(element);
      input.val(input.val().trim());
    });

    let blog = $('#blog-url');
    if (!blog.val().length) blog.val('https://github.com/cedx/akismet');

    let serviceURL = $('#service-url');
    if (!serviceURL.val().length) serviceURL.val('http://localhost:3000');

    let apiKey = $('#api-key');
    if (apiKey.val().length > 0)
      apiKey.closest('.form-group').removeClass('has-error');
    else {
      apiKey.closest('.form-group').addClass('has-error');
      apiKey.focus();
      $('#dialog-alert').modal('show');
      return;
    }

    $('main')
      .empty()
      .append('<div id="mocha"></div>');

    // Run the tests.
    process.env = {
      AKISMET_API_KEY: apiKey.val(),
      AKISMET_BLOG: blog.val(),
      AKISMET_SERVICE_URL: serviceURL.val()
    };

    mocha.setup('bdd');
    require('../../test/author_test');
    require('../../test/blog_test');
    require('../../test/client_test');
    require('../../test/comment_test');
    mocha.run();
  });
});
