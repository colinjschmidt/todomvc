/**
 * TodoMVC Project Specs
 *
 * Use `runs` and `waits` to make sure results are run synchroneously
 */

describe( 'TodoMVC features.', function() {
    
    var keydownEvent = $.Event('keydown', { which: 13, keyCode: 13 });
	var keypressEvent = $.Event('keypress', { which: 13, keyCode: 13 });
	var keyupEvent = $.Event('keyup', { which: 13, keyCode: 13 });
	var todoTitle = 'Foo Bar Todo';

	describe( 'Todo creation:', function() {

		beforeEach( function() {
			// Make sure we are always on the main screen
			window.location.hash = '#/';
		});

		it( 'should allow creating a new todo' , function() {
			runs( function() {
				$( '#new-todo' )
					.val( todoTitle )
					.trigger( keydownEvent )
					.trigger( keypressEvent )
					.trigger( keyupEvent );
			});

			waits( 100 );
			
			runs( function() {
				expect( $( '#todo-list li' ).text()).toMatch( todoTitle );
			});
		});

		it( 'should not allow adding an empty todo' , function() {
			var ourTodo,
				beforeCount = $( '#todo-list li' ).length;

			runs( function(){
				$( '#new-todo' )
					.val( '   ' )
					.trigger( keydownEvent )
					.trigger( keypressEvent )
					.trigger( keyupEvent );
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
				$( '#new-todo' )
					.val( todoTitle + postTitle )
					.trigger( keydownEvent )
					.trigger( keypressEvent )
					.trigger( keyupEvent );
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
				$( '#new-todo' )
					.val( todoTitle + postTitle )
					.trigger( keydownEvent )
					.trigger( keypressEvent )
					.trigger( keyupEvent );
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
				$( '#new-todo' )
					.val( todoTitle + postTitle )
					.trigger( keydownEvent )
					.trigger( keypressEvent )
					.trigger( keyupEvent );
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