$(document).ready(function() {
    var iframe = null;
    var idoc = null;
    var textSelection = null;
    var font_size = null;
    if ( location.href == "http://localhost:8000/this/" ) {
	var this_editor = document.getElementById('editor');
	this_editor.contentEditable = true;
	this_editor.focus();
    }
    else {
	iframe = document.getElementById('ifrm');
	idoc = iframe.contentWindow || iframe.contentWindow.contentDocument;
    }
    $('#ifrm').load(function() {
	$('#ifrm').contents().find('#editor').click(function() {
	    if ( idoc.getSelection ) {
		textSelection = idoc.getSelection();
	    }
	});	
	if ( font_size == null ) {
	    font_size = $('#ifrm').contents().find('#editor').css('font-size').slice(0,2);
	    $('#font_select_id').val( font_size.trim() ).attr('selected', true);
	}
	$('#font_select_id').change(function() {
	    font_size = $('#font_select_id option:selected').text();
	    $('#ifrm').contents().find('#editor').css('font-size',font_size.trim()+'px');
	    
	    var node = idoc.getSelection().anchorNode;
	    if (idoc.getSelection() == node.textContent ) {
		alert('all');
		var range = idoc.getSelection().getRangeAt(0);
		var rangeAncestor = range.commonAncestorContainer;
		alert(rangeAncestor.textContent);
		var startRange = range.startContainer;
		alert(startRange.nodeName);
		alert(startRange.parentNode.id);
	    }
	    else {
		alert('not all');
		var range = idoc.getSelection().getRangeAt(0);
		var rangeAncestor = range.commonAncestorContainer;
		alert(rangeAncestor.textContent);
		var startRange = range.startContainer;
		alert(startRange.parentNode.id);		
		alert(range.startOffset);
		alert(range.endOffset);
		
	    }
	});
    });

});
/*
function isOrContains(node, container) {
    while (node) {
        if (node === container) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function elementContainsSelection(el, idoc) {
    var sel;
    if (idoc.getSelection) {
        sel = idoc.getSelection();
        if (sel.rangeCount > 0) {
            for (var i = 0; i < sel.rangeCount; ++i) {
                if (!isOrContains(sel.getRangeAt(i).commonAncestorContainer, el)) {
                    return false;
                }
            }
            return true;
        }
    } else if ( (sel = idoc.selection) && sel.type != "Control") {
        return isOrContains(sel.createRange().parentElement(), el);
    }
    return false;
}
*/