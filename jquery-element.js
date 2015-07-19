/*
	jquery-element - 1.3.1
	https://github.com/Mr21/jquery-element
*/

(function( $ ) {

var
	list_elemName = {}
;

function initElement( obj, el ) {
	var
		html,
		elNextNode,
		jqHtml,
		jqNestedParent,
		jqElementParent,
		jqElementNext,
		jqElement = $( el )
	;

	// Remove the data-jquery-element attribute to not re-initialize it
	// when the element is detach and reattach to the DOM again.
	delete el.dataset[ "jqueryElement" ];

	// if there is some HTML to include inside the [data-jquery-element].
	if ( html = obj.html ) {
		jqElement.html( html );
	}

	// If there is some HTML to replace the [data-jquery-element].
	if ( html = obj.htmlReplace ) {

		// Creation of the content.
		jqHtml = $( html );

		// If the [data-jquery-element] will NOT be inside this new content...
		if ( html.indexOf( "{{html}}" ) < 0 ) {

			// ...we delete it by .replaceAll.
			jqElement = jqHtml.replaceAll( el );
		} else {

			// Searching of the parent element who are containing
			// the textNode with "{{html}}" inside.
			jqNestedParent = jqHtml.find( ":contains('{{html}}'):last" );
			if ( !jqNestedParent.length ) {
				jqNestedParent = jqHtml;
			}

			jqElementParent = jqElement.parent();
			jqElementNext = jqElement.next();

			// Find the textNode...
			elNextNode = jqNestedParent[0].firstChild;
			for ( ; elNextNode ; elNextNode = elNextNode.nextSibling ) {
				if ( elNextNode.nodeType === 3 &&
					elNextNode.textContent.indexOf( "{{html}}" ) >= 0
				) {

					// ...to be delete and replace by the [data-jquery-element] element.
					jqElement.replaceAll( elNextNode );
					break;
				}
			}

			// Now, all the content (with the [data-jquery-element] inside)
			// will take the old position in the DOM of [data-jquery-element].
			jqElement = jqHtml;
			if ( jqElementNext.length ) {
				jqElement.insertBefore( jqElementNext );
			} else {
				jqElement.appendTo( jqElementParent );
			}
		}
	}

	// Extend the `this` Object with all the methodes of the `prototype:` object.
	jqElement[0].jqueryElementObject = $.extend( {
		jqElement: jqElement
	}, obj.prototype );

	// Call the element's constructor: the `init:` function.
	if ( obj.init ) {
		obj.init.call( jqElement[0].jqueryElementObject );
	}
}

if ( MutationObserver = MutationObserver || WebKitMutationObserver ) {
	new MutationObserver( function( mutations ) {
		var i = 0, j, m, el, obj;
		for ( ; m = mutations[ i ]; ++i ) {
			for ( j = 0; el = m.addedNodes[ j ]; ++j ) {
				obj = el.nodeType === 1 && list_elemName[ el.dataset[ "jqueryElement" ] ];
				if ( obj ) {
					initElement( obj, el );
				}
			}
		}
	}).observe( document, {
		subtree: true,
		childList: true
	});
}

$.element = function( obj ) {
	var
		el,
		elems = $( "[data-jquery-element='" + obj.name + "']" ),
		i = 0
	;
	list_elemName[ obj.name ] = obj;
	if ( obj.css ) {
		obj.style = $( "<style>" )
			.html( obj.css )
			.appendTo( "head" )
		;
	}
	while ( el = elems[ i++ ] ) {
		initElement( obj, el );
	}
};

$.fn.element = function( i ) {
	var len = this.length;
	if ( !i ) {
		i = 0;
	} else if ( ( i = i % len ) < 0 ) {
		i += len;
	}
	if ( this[ i ] ) {
		return this[ i ].jqueryElementObject;
	}
};

})( jQuery );
