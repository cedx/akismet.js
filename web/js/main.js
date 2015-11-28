/**
 * Web interface.
 * @module web/main
 */
'use strict';

/**
 * Application entry point.
 */
$(() => {
  // Enable the tooltips.
  let isTouch=(('ontouchstart' in document.documentElement) || navigator.maxTouchPoints || navigator.msMaxTouchPoints);
  if(!isTouch) $('[data-toggle="tooltip"]').tooltip({placement: 'auto'});

  // Register the button handlers.
  $('#btn-submit').on('click', event => {
    event.preventDefault();

    // Validate the user input.
    $('#form-unit-tests input').each((index, element) => {
      let self=$(element);
      self.val(self.val().trim());
    });

    let blog=$('#blog-url');
    if(!blog.val().length) blog.val('https://github.com/cedx/akismet.js');

    let serviceUrl=$('#service-url');
    if(!serviceUrl.val().length) serviceUrl.val('http://localhost:3000');

    let apiKey=$('#api-key');
    if(apiKey.val().length>0)
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
    process.env={
      AKISMET_API_KEY: apiKey.val(),
      AKISMET_BLOG: blog.val(),
      AKISMET_SERVICE_URL: serviceUrl.val()
    };

    mocha.setup('bdd');
    require('../../test/comment_test');
    require('../../test/client_test');
    mocha.run();
  });
});
