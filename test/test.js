var TEST_DIR = '/home/ec2-user/todomvc/test/functional-tests';

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

page.onConsoleMessage = function (msg) { console.log(msg); };

page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    })
};

page.onLoadStarted = function() {
    loadInProgress = true;
};

page.onLoadFinished = function() {

   setTimeout(function(){ 

      var title = page.evaluate(function () {
        return $('title:first').text();  
      });

      var results = page.evaluate(function() {
        return $('#HTMLReporter ul.symbolSummary:first').html();
        //return jasmine.getEnv().currentRunner().suites_[0].description;
      });
    
      console.log(title);
      console.log('results:');
      console.log(results);

      pageindex++;

      loadInProgress = false;
   }, 200);
}
