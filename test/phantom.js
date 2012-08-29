/**
 * [ description]
 * @return {[type]}
 */
(function() {
  'use strict';
  
  var getIndexPagePaths,
    getPage,
    setupPage,
    getTestResults,
    printResults,
    appCount = 0,
    results = {passed:[], failed:[]};

  /**
   * [getIndexPages description]
   * @return Array An array of index.html page paths
   */
  getIndexPagePaths = function() {

    var fs = require('fs'),
      dir  = fs.absolute('test/functional-tests'),
      apps,
      appPath,
      indexPage,
      indexPagePaths = [];

    apps = fs.list(dir);

    for (var i = 0, len = apps.length; i < len; i++) {

      // Exclude hidden directories
      if (apps[i] === '.' || apps[i] === '..') {
        continue;
      }
      
      // Get the path to the apps index file
      appPath = dir + fs.separator + apps[i];
      indexPage = appPath + fs.separator + 'index.html';
      
      // If the index.html file exists,
      // add it to the indexPagePaths array
      if (fs.isFile(indexPage)) {
        indexPagePaths.push(indexPage);
        appCount = appCount + 1;
      }
    }

    return indexPagePaths;
  };

  /**
   * [getPage description]
   * @return {[type]}
   */
  getPage = function() {
    
    return require('webpage').create();
  };

  /**
   * [setupPage description]
   * @param Page page A PhantomJs Page object
   * @return {[type]}
   */
  setupPage = function(page) {

    page.onConsoleMessage = function(msg) {
      console.log(msg);
    };

    page.onError = function(msg, trace) {
      console.log(msg);
      trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
      });
    };

    page.onLoadFinished = function() {
      setTimeout(function(){
        getTestResults(page);
      }, 1500);
    };

    return page;
  };

  /**
   * [getTestResults description]
   * @return {[type]}
   */
  getTestResults = function(page) {

    var title,
      testResults,
      resultCount;

      title = page.evaluate(function () {
        return $('title:first').text();
      });

      testResults = page.evaluate(function() {
        var success = true,
          results   = {success:true, specs:[]},
          specs     = $('#HTMLReporter .summary .specSummary');

        $(specs).each(function(){
          var passed = $(this).hasClass('passed');

          if (passed === false) {
            success = false;
          }
          
          results.specs.push({
            title: $('a:first', this).attr('title'),
            success: passed
          });

        });

        results.success = success;
        return results;
      });

      testResults.title = title;
      if (testResults.success === true) {
        results.passed.push(testResults);
      }
      else {
        results.failed.push(testResults);
      }

      resultCount = results.passed.length + results.failed.length;
      if (resultCount >= appCount) {
        printResults();
      }
  };

  printResults = function() {
    var success = 1;

    results.passed.forEach(function(result){
        console.log("\u2714 "+result.title);
    });

    results.failed.forEach(function(result){
      success = 0;
      console.log("\u2716 " + result.title);
      result.specs.forEach(function(spec){
        if (spec.success === false) {
          console.log("\u0009 \u2716 " + spec.title);
        }
      });
    });

    phantom.exit(success);
  };

  (function(){
    getIndexPagePaths()
      .forEach(function(path) {
          
          var page = setupPage(getPage());

          page.open(path);
      });
  })();

})();
