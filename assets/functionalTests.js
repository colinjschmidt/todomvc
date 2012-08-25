/*
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
	  	
	  	$focused = $( document.activeElement ).first().attr('id');
      expect($focused).toBe('new-todo');

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
	    $event.keyCode = 13;
	    $input.trigger($event);
      
      // Get the number of todos in the todo-list
	    lengthAfter = $todoList.find('li').length;
      
      // Verify that there is one more todo than there used to be
	    expect(lengthAfter).toBe(lengthBefore + 1);

	  });

	  it('regains focus after adding a new todo', function() {

      $focused = $( document.activeElement ).first().attr('id');
      expect($focused).toBe('new-todo');
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
*/

/**
 * TodoMVC Project Specs
 *
 * Use `runs` and `waits` to make sure results are run synchroneously
 */

describe( 'TodoMVC features.', function(){

	var enterEvent = $.Event('keypress', { which: 13, keyCode: 13 });
	var todoTitle = 'Foo Bar Todo';

	describe( 'Todo creation:', function() {

		beforeEach( function() {
			// Make sure we are always on the main screen
			window.location.hash = '#/';
		});

		it( 'should allow creating a new todo' , function() {
			runs( function() {
				$( '#new-todo' ).val( todoTitle ).trigger( enterEvent );
			});

			waits( 500 );
			
			runs( function() {
				expect( $( '#todo-list li' ).text()).toMatch( todoTitle );
			});
		});

		it( 'should not allow adding an empty todo' , function() {
			var ourTodo,
				beforeCount = $( '#todo-list li' ).length;

			runs( function(){
				$( '#new-todo' ).val( '   ' ).trigger( enterEvent );
			});

			waits( 100 );

			runs( function(){
				expect( $( '#todo-list li' ).length ).toEqual( beforeCount );
			});
		});
	});

	describe( 'Todo completion:', function() {
		it( 'should allow marking a todo complete' , function() {
			var ourTodo,
				beforeCount = $( '#todo-list li.completed' ).length,
				postTitle = ' to be completed';

			runs( function(){
				$( '#new-todo' ).val( todoTitle + postTitle ).trigger( enterEvent );
			});

			waits( 100 );

			runs( function() {
				ourTodo = $( '#todo-list li:last-child' );

				expect( ourTodo.text() ).toMatch( postTitle );
				ourTodo.find( '.toggle' ).click();
				expect( $( '#todo-list li.completed' ).length ).toEqual( beforeCount + 1 );
			});
		});

		it( 'should allow clearing completed todos' , function() {
			var ourTodo,
				beforeCount = $( '#todo-list li.completed' ).length,
				postTitle = ' to be completed';

			runs( function(){
				$( '#new-todo' ).val( todoTitle + postTitle ).trigger( enterEvent );
			});

			waits( 100 );

			runs( function() {
				ourTodo = $( '#todo-list li:last-child' );

				expect( ourTodo.text() ).toMatch( postTitle );
				ourTodo.find( '.toggle' ).click();
				$( '#clear-completed' ).click();
				expect( $( '#todo-list li.completed' ).length ).toEqual( 0 );
			});
		});
	});

	describe( 'Todo deletion:', function() {
		it( 'should allow deleting a todo' , function() {
			var ourTodo,
				beforeCount = $( '#todo-list li' ).length,
				postTitle = ' to be deleted';

			runs( function(){
				$( '#new-todo' ).val( todoTitle + postTitle ).trigger( enterEvent );
			});

			waits( 100 );

			runs( function() {
				ourTodo = $( '#todo-list li:last-child' );

				expect( ourTodo.text() ).toMatch( postTitle );
				ourTodo.find( '.destroy' ).click();
				expect( $( '#todo-list li' ).length ).toEqual( beforeCount );
			});
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

  $(function(){jasmineEnv.execute();});
})();