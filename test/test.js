console.log('testing');

phantom.libraryPath = '/home/ec2-user/todomvc/assets';

var TEST_DIR = '/home/ec2-user/todomvc/architecture-examples';

var page = require('webpage').create(), 
  fs = require('fs'),
  loadInProgress = false,
  apps = [],
  pages = [];

apps = fs.list(TEST_DIR);

for (var i = 0, len = apps.length; i < len; i++) {
  
  if (apps[i] === '.' || apps[i] === '..') {
    continue;
  }

  var fullPath = TEST_DIR + fs.separator + apps[i];
  var indexFile = fullPath + fs.separator + 'index.html';
  if (fs.isFile(indexFile)) {  
    console.log(indexFile);
    pages.push(indexFile);
  }
}

var pageindex = 0;

var interval = setInterval(function() {
    if (!loadInProgress && pageindex < pages.length) {
        page.open(pages[pageindex]);
    }
    if (pageindex == pages.length) {
        console.log("testing complete!");
        phantom.exit();
    }
}, 250);

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log('page ' + (pageindex + 1) + ' load started');
};

page.onLoadFinished = function() {
    
    var s = phantom.injectJs("jquery.min.js");

    console.log(s);
    /*
    page.injectJs("jasmine/jasmine.js");
    page.injectJs("jasmine/jasmine-html.js");
    page.injectJs("../test/functional.js");
    */
    var title = page.evaluate(function () {
        return $('title:first').text();
    });
    
    console.log('test - ' + title);

    console.log('page ' + (pageindex + 1) + ' load finished');
    pageindex++;

    loadInProgress = false;
}
