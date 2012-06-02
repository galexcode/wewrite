$(document).ready(function() {
    var iframe = null;
    var idoc = null;
    var textSelection = null;
    var font_size = null;
    var count=1;
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
	$('#save_text_form').submit(function() {
	    alert("Saving.");
	    $("#textBodyInputId").val(document.getElementById('ifrm').contentWindow.document.getElementById('editor').innerHTML);
	    alert("Saved.");
	    return true;
	});
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
	    font_size = $('#font_select_id option:selected').text().trim();
	    var node = idoc.getSelection().anchorNode;
	    // Selected the whole node
	    if (idoc.getSelection() == node.textContent ) {
		var range = idoc.getSelection().getRangeAt(0);
		var rangeAncestor = range.commonAncestorContainer;
		var startRange = range.startContainer;
		var thisNode = document.getElementById('ifrm').contentWindow.document.getElementById(startRange.parentNode.id);
		thisNode.style.fontSize = font_size.trim() + "px";
	    }
	    // Selected part of the node
	    else if ( idoc.getSelection() != null ) {
		var range = idoc.getSelection().getRangeAt(0);
		var rangeAncestor = range.commonAncestorContainer;
		var startRange = range.startContainer;
		var containingNodeID = startRange.parentNode.id;
		var rangeParentNode = document.getElementById('ifrm').contentWindow.document.getElementById(containingNodeID);
		var nextID = "";
		var newSpan = null;
		var anchorNode = idoc.getSelection().anchorNode;
		var curText = anchorNode.textContent;
		var endSelectionOffset = range.endOffset;
		var startSelectionOffset = range.startOffset;
		var minMaxOrder = minMax(endSelectionOffset, startSelectionOffset);
		startSelectionOffset = minMaxOrder[0];
		endSelectionOffset = minMaxOrder[1];
		var addText = anchorNode.textContent.substring(startSelectionOffset,endSelectionOffset);
		// Can safely make the span the last element in the parentNode
		// Actually, you can't if you consider the idea of a multi-node selection range.
		if ( endSelectionOffset == anchorNode.textContent.length ) {
		    newSpan = document.createElement('span');
		    newSpan.textContent = addText;
		    newSpan.style.fontSize = font_size.trim() + "px";
		    curText = anchorNode.textContent.substring(0,startSelectionOffset);
		    // Check if the parent element has a tilda in its id.
		    if ( rangeParentNode.id.split('~').length - 1 ) {
			var rangeParentNodeIdList = rangeParentNode.id.split('~');
			// Parent is a top-level element
			if ( rangeParentNodeIdList.length == 1 ) {
			    var curLastChildID = rangeParentNode.lastChild.id;
			    if ( curLastChildID ) {
				var lastElementIndex = curLastChildID.split("~").length - 1;
				var lastElement = curLastChildID.split("~")[lastElementIndex];
				// Is this going to work? Probably not. Should test this.
				var upToLastElement = curLastChildID.slice(0,lastElement);
				var lastElementNumber = parseInt(lastElement);
				nextID = upToLastElement + "~" + ++lastElementNumber;
			    }
			    else
			    {
				for ( var i = 0; i < rangeParentNode.childNodes.length;i++ ) {
				    if ( rangeParentNode.childNodes[i].id ) {
					curLastChildID = rangeParentNode.childNodes[i].id;
				    }
				}
				if ( curLastChildID ) {
				    var lastElementIndex = curLastChildID.split("~").length - 1;
				    var lastElement = curLastChildID.split("~")[lastElementIndex];
				    var upToLastElement = curLastChildID.slice(0,lastElement);
				    var lastElementNumber = parseInt(lastElement);
				    nextID = upToLastElement + "~" + ++lastElementNumber;
				}
				else {
				    nextID = containingNodeID + "~1";
				}
			    }
			}
			// Sub-level element
			else {
			    // New id based off the last child's id
			    var curLastChildID = rangeParentNode.lastChild.id;
			    if ( curLastChildID )
			    {
				var upToLastElement = curLastChildID.slice(0,curLastChildID.split("~")[curLastChildID.split("~").length - 1]);
				var lastElementNumber = parseInt(curLastChildID.split("~")[curLastChildID.split("~").length - 1]);
				nextID = upToLastElement + "~" + ++lastElementNumber;
			    }
			    else
			    {
				nextID = containingNodeID + "~1";
			    }
			}
		    }
		    else
		    {
			for ( var i = 0; i < rangeParentNode.childNodes.length;i++ ) {
			    if ( rangeParentNode.childNodes[i].id ) {
				curLastChildID = rangeParentNode.childNodes[i].id;
			    }
			}
			if ( curLastChildID ) {
			    nextID = getNewID(curLastChildID);
			}
			else {
			    nextID = containingNodeID + "~1";
			}
		    }
		    var curLastText = rangeParentNode.lastChild.textContent.substring(0,range.startOffset);
		    rangeParentNode.lastChild.textContent = curLastText;
		    //newSpan.id = nextID;
		    newSpan.setAttribute("id",nextID);
		    rangeParentNode.appendChild(newSpan);		    
		}
		// The beginning of the node
		else if ( range.startOffset == 0 ) {
		    addText = curText.substring(startSelectionOffset, endSelectionOffset);
		    newSpan = document.createElement('span');
		    newSpan.textContent = addText;
		    newSpan.style.fontSize = font_size.trim() + "px";
		    curText = curText.substring(endSelectionOffset, curText.length);
		    nextID = containingNodeID + "~" + 1;
		    newSpan.setAttribute("id",nextID);
		    rangeParentNode.firstChild.textContent = rangeParentNode.firstChild.textContent.substring(endSelectionOffset);
		    // Increase the ids of any existing children with ids
		    for ( var i = 0; i < rangeParentNode.childNodes.length;i++ ) {
			if ( rangeParentNode.childNodes[i].id ) {
			    /*
			    var lastElement = rangeParentNode.childNodes[i].id.split("~")[rangeParentNode.childNodes[i].id.split("~").length - 1];
			    var lastIndex = 1;
			    for ( var j = rangeParentNode.childNodes[i].id.length - 1; j > -1; j--  ) {
				if ( rangeParentNode.childNodes[i].id[j] == "~" ) {
				    lastIndex = j;
				    j == -1;
				}
			    }
			    var nextNum = parseInt(lastElement);
			    nextID = rangeParentNode.childNodes[i].id.slice(0,lastIndex) + "~" + ++nextNum;
			    //rangeParentNode.childNodes[i].id = nextID;
			    */
			    // Test this before removing above multi-line commented-out code.
			    nextID = getNewID(rangeParentNode.childNodes[i].id);
			    rangeParentNode.childNodes[i].setAttribute("id",nextID);
			}
		    }
		    rangeParentNode.insertBefore(newSpan,rangeParentNode.firstChild);
		    alert(rangeParentNode.firstChild.id);
		}
		// offset 1 to length - 2 for startOffset, endOffSet
		else {
		    newSpan = document.createElement('span');
		    var anchorNode = idoc.getSelection().anchorNode;
		    var nextSibling = null
		    if ( rangeParentNode.contains(anchorNode) )
		    {
			for ( var i = 0; i < rangeParentNode.childNodes.length;i++  ) {
			    if ( rangeParentNode.childNodes[i].isEqualNode(anchorNode) ) {
				nextSibling = rangeParentNode.childNodes[i++].nextSibling;
			    }
			}
		    }
		    if ( nextSibling ) {
			newSpan.textContent = anchorNode.textContent.substring(startSelectionOffset,endSelectionOffset);
			newSpan.id = nextSibling.id;
			newSpan.style.fontSize = font_size.trim() + "px";
			var adjacentHTML = anchorNode.textContent.substring(endSelectionOffset,anchorNode.textContent.length);
			adjacentHTML = document.createTextNode(adjacentHTML);
			anchorNode.textContent = anchorNode.textContent.substring(0,startSelectionOffset);
			rangeParentNode.insertBefore(newSpan,nextSibling);
			rangeParentNode.insertBefore(adjacentHTML,nextSibling);
			while ( nextSibling ) {
			    if ( nextSibling.id ) {
				var lastElementIndex = nextSibling.id.split("~").length - 1;
				var lastElement = nextSibling.id.split("~")[lastElementIndex];
				var upToLastElement = nextSibling.id.split("~").slice(0,lastElementIndex);
				var lastElementNumber = parseInt(lastElement);
				nextID = upToLastElement + "~" + ++lastElementNumber;
				nextSibling.setAttribute("id",nextID);
			    }
			    nextSibling = nextSibling.nextSibling;
			}
		    }
		    else if ( anchorNode.prevSibling ) {
			newSpan.textContent = range;
			if ( anchorNode.prevSibling.id ) {
			    var upToLastElement = anchorNode.prevSibling.id.slice(0,anchorNode.prevSibling.id.split("~")[anchorNode.prevSibling.id.split("~").length - 1]);
			    var lastElementNumber = parseInt(anchorNode.prevSibling.id.split("~")[anchorNode.prevSibling.id.split("~").length - 1]);
			    nextID = upToLastElement + "~" + ++lastElementNumber;
			}
			else {
			    var lastNumberedID = "";
			    for ( var i = 0; i < anchorNode.parentNode.childList.length; i++ ) {
				if ( anchorNode.parentNode.childList[i].id ) {
				    lastNumberedID = anchorNode.parentNode.childList[i].id;
				}
			    }
			    var upToLastElement = lastNumberedID.slice(0,lastNumberedID.split("~")[lastNumberedID.split("~").length - 1]);
			    var lastElementNumber = parseInt(lastElementNumberedID.split("~")[lastElementNumberedID.split("~").length - 1]);
			    nextID = upToLastElement + "~" + ++lastElementNumber;
			}
			newSpan.setAttribute("id",nextID);
			rangeParentNode.appendChild(newSpan);
		    }
		    else {
			newSpan.textContent = range;
			nextID = containingNodeID + "~1";
			newSpan.setAttribute("id",nextID);
			rangeParentNode.appendChild(newSpan);
		    }
		}
	    }
	});
    });
    jQuery(document).ajaxSend(function(event, xhr, settings) {
	function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
			cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
			break;
                    }
		}
            }
            return cookieValue;
	}
	function sameOrigin(url) {
            // url could be relative or scheme relative or absolute
            var host = document.location.host; // host + port
            var protocol = document.location.protocol;
            var sr_origin = '//' + host;
            var origin = protocol + sr_origin;
            // Allow absolute or scheme relative URLs to same origin
            return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
		(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
	}
	function safeMethod(method) {
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	
	if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	}
    }); 
});

function minMax(x, y) {
    if ( y < x )
    {
	var temp = x;
	x = y;
	y = temp;
    }
    return [x,y];
}

function getNewID( id ) {
    var lastElementIndex = id.split("~").length - 1;
    var lastElement = id.split("~")[lastElementIndex];
    var lastTildaIndex = 0;
    for ( var i = id.length - 1; i > -1; i-- ) {
	if ( id[i] == "~" ) {
	    lastTildaIndex = i;
	    break;
	}
    }
    var upToLastElement = id.slice(0,lastTildaIndex);
    var lastElementNumber = parseInt(lastElement);
    nextID = upToLastElement + "~" + ++lastElementNumber;
    return nextID;
}