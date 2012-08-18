describe('TodoMVC App', function() {

	describe('Initial state without any todos', function() {

		it("contains one section tag with id of todoapp", function() {
	    
	    var $elements;

	    $elements = $('section#todoapp');
	    expect($elements.length).toBe(1);

	  });

	  it("contains one header tag with id of header", function() {
	    
	    var $elements;

	    $elements = $('header#header');
	    expect($elements.length).toBe(1);

	  });

	  it("contains one footer tag with id of footer", function() {
	    
	    var $elements;

	    $elements = $('footer#footer');
	    expect($elements.length).toBe(1);

	  });

	  it('contains the text \'todos\' inside an h1 tag', function() {
	    
	    var $element,
	      text;
	    
	    // Get the h1 element's text
	    $element = $('header h1:first');
	    text = $element.text();
	    
	    expect(text).toBe('todos');

	  });
	  
	  it('autofocuses on the #new-todo input field', function() {
	  	
	  	var $element,
	  		hasFocus = false;

	  	$element = $('input#new-todo:first');
	  	hasFocus = $element.is(':focus');

	  	expect(hasFocus).toBe(true);

	  });

	  it('hides the #main and #footer elements when there are no todos', function() {
	  	
	  	var $main,
	  	  $footer,
	  	  mainVisible,
	  	  footerVisible;

	  	$main = $('#main');
	  	mainVisible = $main.is(':visible');

	  	$footer = $('#footer');
	  	footerVisible = $footer.is(':visible');

	  	expect(mainVisible).toBe(false);
	  	expect(footerVisible).toBe(false);

	  });

	});

  describe('The #new-todo input field', function() {
    
    it('contains the placeholder text \'What needs to be done?\'', function() {

      var $input,
        placeholder;

      $input = $('input#new-todo:first');
      placeholder = $input.attr('placeholder');

      expect(placeholder).toBe('What needs to be done?');
    }); 

	  it('adds a todo by pressing the enter key', function() {
	    
	    var $input,
	      $event,
	      $todoList,
	      lengthBefore,
	      lengthAfter;
	    
	    // Get the #todo-list element 
	    // and determine the number of list items
	    $todoList = $('ul#todo-list:first');
	    lengthBefore = $todoList.find('li').length;
      
      // Get the #new-post input field
      // and set the value to 'test'
	    $input = $('input#new-todo');
	    $input.val('test');

      // Create a new jQuery Event representing
      // a user pressing the enter key while 
      // focused on the $new-todo input field
	    $event = $.Event("keypress");
	    $event.which = 13;
	    $input.trigger($event);
      
      // Get the number of todos in the todo-list
	    lengthAfter = $todoList.find('li').length;
      
      // Verify that there is one more todo than there used to be
	    expect(lengthAfter).toBe(lengthBefore + 1);

	  });

	  it('regains focus after adding a new todo', function() {
      
      var $element,
	  		hasFocus = false;

	  	$element = $('input#new-todo:first');
	  	hasFocus = $element.is(':focus');

	  	expect(hasFocus).toBe(true);

	  });

  });

  describe('The footer element once a todo item exists', function() {

    it ('is visible', function() {

      var $footer,
        isVisible;

      $footer = $('footer#footer:first');
      isVisible = $footer.is(':visible');

      expect(isVisible).toBe(true);
    });

    it ('contains a span#todo-count element with the text \'1 item left\'', function() {

      var $span,
        text;

      $span = $('#footer span#todo-count:first');
      text = $span.text();

      expect(text).toBe('1 item left');

    });

    it ('contains a ul#filters element containing a list of 3 filters', function() {
      
      var $ul,
        length;

      $ul = $('#footer ul#filters:first');
      length = $ul.find('li').length;

      expect(length).toBe(3);

    });

  });

});

(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 250;

  /**
   Create the `HTMLReporter`, which Jasmine calls to provide results of each spec and each suite. The Reporter is responsible for presenting results to the user.
   */
  var htmlReporter = new jasmine.HtmlReporter();
  jasmineEnv.addReporter(htmlReporter);

  /**
   Delegate filtering of specs to the reporter. Allows for clicking on single suites or specs in the results to only run a subset of the suite.
   */
  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  /**
   Run all of the tests when the page finishes loading - and make sure to run any previous `onload` handler

   ### Test Results

   Scroll down to see the results of all of these specs.
   */
  var currentWindowOnload = window.onload;
  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }

    //document.querySelector('.version').innerHTML = jasmineEnv.versionString();
    execJasmine();
  };

  function execJasmine() {
    jasmineEnv.execute();
  }
})();