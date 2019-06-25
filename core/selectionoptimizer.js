( function() {
	CKEDITOR.dom.selection.prototype.optimizeInElementEnds = function() {
		var range = this.getRanges()[ 0 ];

		if ( range.isCollapsed ) {
			return;
		}

		if ( range.startContainer.equals( range.endContainer ) ) {
			return;
		}

		if ( !shouldOptimize( range ) ) {
			return;
		}

		range.shrink( CKEDITOR.SHRINK_TEXT );

		preventRecurrency( this.root.editor, range );

		range.select();
	};

	// Returns whether any condition is met:
	// - range starts at the end of an element.
	// - range ends at the beginning of an element.
	// - one end of range is in text, and another is not.
	function shouldOptimize( range ) {
		if ( range.endOffset === 0 ) {
			return true;
		}

		var startsInText = range.startContainer.type === CKEDITOR.NODE_TEXT,
			limit = startsInText ? range.startContainer.getLength() : range.startContainer.getChildCount();

		if ( range.startOffset === limit ) {
			return true;
		}

		return startsInText ^ range.endContainer.type === CKEDITOR.NODE_TEXT;
	}

	// Prevent infinite recurrency when browser doesn't allow expected selection.
	function preventRecurrency( editor, range ) {
		editor.once( 'selectionCheck', function( evt ) {
			var newRange = evt.data.getRanges()[ 0 ];

			if ( !CKEDITOR.tools.objectCompare( newRange, range ) ) {
				evt.cancel();
			}
		}, null, null, -1 );
	}
} )();
