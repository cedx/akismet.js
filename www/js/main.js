/* global $, mocha */

/**
 * Web interface.
 * @module www.main
 */
'use strict';

/**
 * Runs the unit tests in a browser.
 * @class tests.web.main
 * @static
 */

/**
 * Application entry point.
 * @method main
 * @static
 */
function main() {
  // Enable tooltips.
  var isTouch=(('ontouchstart' in document.documentElement) || navigator.maxTouchPoints || navigator.msMaxTouchPoints);
  if(!isTouch) $('[data-toggle="tooltip"]').tooltip({ placement: 'auto' });

  // Register button handlers.
  $('#btn-submit').on('click', function(event) {
    event.preventDefault();

    // Validate the user input.
    $('#form-unit-tests input').each(function() {
      var self=$(this);
      self.val($.trim(self.val()));
    });

    var blog=$('#blog-url');
    if(!blog.val().length) blog.val('http://dev.belin.io/akismet.js');

    var serviceUrl=$('#service-url');
    if(!serviceUrl.val().length) serviceUrl.val('http://localhost:3000');

    var apiKey=$('#api-key');
    if(apiKey.val().length>0) apiKey.closest('.form-group').removeClass('has-error');
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
}

// Start the application.
$(main);
