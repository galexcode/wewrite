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
	    //alert(document.getElementById('ifrm').contentWindow.document.getElementById('editor').firstElementChild.innerHTML);
	    font_size = $('#font_select_id option:selected').text();
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
		var parNode = document.getElementById('ifrm').contentWindow.document.getElementById(containingNodeID);
		var nextID = "";
		var newSpan = null;
		var addToOffSet = 0;
		var haveIDTextLengths = [];
		var noIDTextLengths = [];
		var haveI = 0;
		var noI = 0;
		for ( var i = 0; i < parNode.childNodes.length; i++ ) {
		    if ( parNode.childNodes[i].id ) {
			haveIDTextLengths[haveI++] = parNode.childNodes[i].textContent.length;
			//alert('id\s text: '+parNode.childNodes[i].textContent);
			addToOffSet += parNode.childNodes[i].textContent.length;
		    }
		    else {
			noIDTextLengths[noI++] = parNode.childNodes[i].textContent.length;
			//alert('no id: '+parNode.childNodes[i].textContent);
		    }
		}
		//alert(haveIDTextLengths);
		//alert(noIDTextLengths);
		// Consider making this go up until nodeType is 'p', or a heading.
		for ( var i = 0; i < parNode.childNodes.length; i++ ) {
		    if ( parNode.childNodes[i].id ) {
			addToOffSet += parNode.childNodes[i].textContent.length;
		    }
		}
		var curText = idoc.getSelection().anchorNode.textContent;
		//var addText = curText.substring(range.startOffset+addToOffSet, range.endOffset+1+addToOffSet);
		var addText = idoc.getSelection().anchorNode.textContent.substring(range.startOffset,range.endOffset);
		// Can safely make the span the last element in the parentNode
		if ( range.endOffset /*+ addToOffSet*/ == idoc.getSelection().anchorNode.textContent.length ) {
		    newSpan = document.createElement('span');
		    newSpan.textContent = addText;
		    newSpan.style.fontSize = font_size.trim() + "px";
		    curText = idoc.getSelection().anchorNode.textContent.substring(0,range.startOffset);//curText.substring(0,range.startOffset+addToOffSet);
		    // Check if the parent element has a tilda in its id.
		    if ( parNode.id.split('~').length - 1 ) {
			var parNodeIdList = parNode.id.split('~');
			// Parent is a top-level element
			if ( parNodeIdList.length == 1 ) {
			    var curLastChildID = parNode.lastChild.id;
			    if ( curLastChildID ) {
				var upToLastElement = curLastChildID.slice(0,curLastChildID.split("~")[curLastChildID.split("~").length - 1]);
				var lastElementNumber = parseInt(curLastChildID.split("~")[curLastChildID.split("~").length - 1]);
				nextID = upToLastElement + "~" + ++lastElementNumber; //containingNodeID + "~" + ++idNumInt;
			    }
			    else
			    {
				nextID = containingNodeID + "~1";
			    }
			}
			// Sub-level element
			else {
			    // New id based off the last child's id
			    var curLastChildID = parNode.lastChild.id;
			    if ( curLastChildID )
			    {
				var upToLastElement = curLastChildID.slice(0,curLastChildID.split("~")[curLastChildID.split("~").length - 1]);
				var lastElementNumber = parseInt(curLastChildID.split("~")[curLastChildID.split("~").length - 1]);
				nextID = upToLastElement + "~" + ++lastElementNumber; //containingNodeID + "~" + ++idNumInt;
			    }
			    else
			    {
				nextID = containingNodeID + "~1";
			    }
			}
		    }
		    else {
			// Parent is a top-level element
			var curLastChildID = parNode.lastChild.id;
			if ( curLastChildID == null ) {
			    nextID = parNode.id + "~" + 1;
			}
			else {
			    var lastElement = curLastChildID.split("~")[curLastChildID.split("~").length - 1];
			    var lastIndex = 1;
			    for ( var i = curLastChildID.length - 1; i > -1; i--  ) {
				if ( curLastChildID[i] == "~" ) {
				    lastIndex = i;
				    i == -1;
				}
			    }
			    var nextNum = parseInt(lastElement);
			    nextID = curLastChildID.slice(0,lastIndex) + "~" + ++nextNum;
			}
		    }
		    var curLastText = parNode.lastChild.textContent.substring(0,range.startOffset);
		    parNode.lastChild.textContent = curLastText;
		    newSpan.id = nextID;
		    parNode.appendChild(newSpan);		    

		    /*curText = curText.substring(0,range.startOffset);
		    parNode.textContent = curText;
		    var htmlToInsert = '<span id="insertID">TEXT</span>';
		    htmlToInsert = htmlToInsert.replace(/insertID/,nextID);
		    htmlToInsert = htmlToInsert.replace(/TEXT/,addText);
		    parNode.insertAdjacentHTML('afterend',htmlToInsert);*/
		}
		// The beginning of the node
		else if ( range.startOffset == 0 ) {
		    addText = curText.substring(range.startOffset, range.endOffset);
		    newSpan = document.createElement('span');
		    newSpan.textContent = addText;
		    newSpan.style.fontSize = font_size.trim() + "px";
		    curText = curText.substring(range.endOffset, curText.length);
		    nextID = containingNodeID + "~" + 1;
		    newSpan.id = nextID;
		    parNode.firstChild.textContent = parNode.firstChild.textContent.substring(range.endOffset);
		    for ( var i = 0; i < parNode.childNodes.length;i++ ) {
			if ( parNode.childNodes[i].id ) {
			    var lastElement = parNode.childNodes[i].id.split("~")[parNode.childNodes[i].id.split("~").length - 1];
			    var lastIndex = 1;
			    for ( var j = parNode.childNodes[i].id.length - 1; j > -1; j--  ) {
				if ( parNode.childNodes[i].id[j] == "~" ) {
				    lastIndex = j;
				    j == -1;
				}
			    }
			    var nextNum = parseInt(lastElement);
			    nextID = parNode.childNodes[i].id.slice(0,lastIndex) + "~" + ++nextNum;
			    parNode.childNodes[i].id = nextID;
			}
		    }
		    parNode.insertBefore(newSpan,parNode.firstChild);
		}
		// offset 1 to length - 2 for startOffset, endOffSet
		else {
		    //alert('addToOffset: '+ addToOffSet);
		    //alert(parNode.textContent);
		    alert('offset: '+range.endOffset);
		    newSpan = document.createElement('span');
		    var anchorNode = idoc.getSelection().anchorNode;
		    var nextSibling = null
		    if ( parNode.contains(anchorNode) )
		    {
			for ( var i = 0; i < parNode.childNodes.length;i++  ) {
			    if ( parNode.childNodes[i].isEqualNode(anchorNode) ) {
				nextSibling = parNode.childNodes[i++].nextSibling;
			    }
			}
		    }
		    if ( nextSibling ) {
			newSpan.textContent = anchorNode.textContent.substring(range.startOffset,range.endOffset);
			newSpan.id = nextSibling.id;
			newSpan.style.fontSize = font_size.trim() + "px";
			var adjacentHTML = anchorNode.textContent.substring(range.endOffset,anchorNode.textContent.length);
			adjacentHTML = document.createTextNode(adjacentHTML);
			anchorNode.textContent = anchorNode.textContent.substring(0,range.startOffset);
			parNode.insertBefore(newSpan,nextSibling);
			parNode.insertBefore(adjacentHTML,nextSibling);
			while ( nextSibling ) {
			    if ( nextSibling.id ) {
				var lastElementIndex = nextSibling.id.split("~").length - 1;
				var lastElement = nextSibling.id.split("~")[lastElementIndex];
				alert('lastElement: ' + lastElement)
				var upToLastElement = nextSibling.id.split("~").slice(0,lastElementIndex);
				alert('upToLastElement: ' + upToLastElement);
				var lastElementNumber = parseInt(lastElement);
				nextID = upToLastElement + "~" + ++lastElementNumber;
				alert(nextID);
				nextSibling.id = nextID;
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
			newSpan.id = nextID;
			parNode.appendChild(newSpan);
		    }
		    else {
			newSpan.textContent = range;
			nextID = containingNodeID + "~1";
			newSpan.id = nextID;
			parNode.appendChild(newSpan);
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