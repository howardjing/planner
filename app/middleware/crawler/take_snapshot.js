// use phantomjs to render the html of a url
// based on: https://github.com/yearofmoo-articles/AngularJS-SEO-Article/blob/master/.phantomjs-runner.js

var system = require('system');
var url = system.args[1] || '';

if (url.length > 0 && url.indexOf("_escaped_fragment_") == -1) {
  var page = require('webpage').create();
  page.open(url, function(status) {
    if (status == 'success') {
      var delay, checker = (function() {
        var html = page.evaluate(function () {
          var html;
          // going to assume that all pages have at least one element inside of ng-view
          if(document.getElementsByTagName('ng-view')[0].children.length > 0) {
            html = document.getElementsByTagName('html')[0].outerHTML;
          }
          return html;
        });

        // if the html loaded
        if(html) {
          console.log(html)
          clearTimeout(delay);
          phantom.exit();
        }
      });
      delay = setInterval(checker, 100);
    } else {
      console.log("Error querying url " + url + " :(");
      phantom.exit();
    }
  });
}

 
