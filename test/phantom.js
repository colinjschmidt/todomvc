/**
 * End-to-End functional test runner for TodoMVC project
 *
 * This script is meant to be run using PhantomJS from the project root,
 * like this:
 * <code>
 *     phantomjs test/phantom.js
 * </code>
 *
 * @return void
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
   * Gets the path to each app's index page from
   * within the functional-tests folder
   *
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
   * Creates a PhantomJS page object
   *
   * @return Page a PhantomJS Page object
   */
  getPage = function() {
    return require('webpage').create();
  };

  /**
   * Sets up the PhantomJS Page
   *
   * Sets up the PhantomJS Page to do things like
   * output any javascript errors or console messages
   * that occurred during execution. Also attachs an
   * onLoadFinished event handler.
   *
   * @param Page page PhantomJs Page object
   * @return Page The same PhantomJs Page object
   */
  setupPage = function(page) {

    // Display browser console message in PhantomJS console
    page.onConsoleMessage = function(msg) {
      console.log(msg);
    };
    
    // Display browser errors in PhantomJS console
    page.onError = function(msg, trace) {
      console.log(msg);
      trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
      });
    };

    // Handle page load finish event
    page.onLoadFinished = function() {
      setTimeout(function(){
        getTestResults(page);
      }, 1500);
    };

    return page;
  };

  /**
   * Gets test results for a single app from the browser's html
   *
   * @return void
   */
  getTestResults = function(page) {

    var title,
      testResults,
      resultCount;

      // Get the test results from the browser html
      testResults = page.evaluate(function() {
        var success = true,
          results   = {success:true, specs:[]},
          specs     = $('#HTMLReporter .summary .specSummary');

        // Loop through all of the .specSummary elements
        $(specs).each(function(){

          // Determine whether the spec passed, by examining the class
          var passed = $(this).hasClass('passed');

          if (passed === false) {
            success = false;
          }

          // Add the spec to the results object
          results.specs.push({
            title: $('a:first', this).attr('title'),
            success: passed
          });
        });

        results.success = success;
        return results;
      });

      // Get the app's title from the <title> tag
      testResults.title = page.evaluate(function () {
        return $('title:first').text();
      });

      // Add the testResults to either the passed or failed results array
      if (testResults.success === true) {
        results.passed.push(testResults);
      }
      else {
        results.failed.push(testResults);
      }

      // If all app's have been tested, print the results to the console.
      resultCount = results.passed.length + results.failed.length;
      if (resultCount >= appCount) {
        printResults();
      }
  };

  /**
   * Prints the final test results for each app and exits with appropriate code
   *
   * @return void
   */
  printResults = function() {
    var success = true;

    // Print all of the passing tests first,
    // with a little check mark next to them
    results.passed.forEach(function(result){
        console.log("\u2714 "+result.title);
    });

    // Print all of the failing tests next,
    // with a little x next to them and
    // the list of failing specs nested beneath
    results.failed.forEach(function(result){
      success = false;
      console.log("\u2716 " + result.title);
      result.specs.forEach(function(spec){
        if (spec.success === false) {
          console.log("\u0009 \u2716 " + spec.title);
        }
      });
    });

    // Exit with correct status code, 0 for success or 1 for failure.
    phantom.exit(success ? 0 : 1);
  };

  // Run the tests by opening each app using PhantomJS
  (function(){
    getIndexPagePaths()
      .forEach(function(path) {
          
          var page = setupPage(getPage());
          page.open(path);
      });
  })();

})();
