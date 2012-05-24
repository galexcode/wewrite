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
	    var editorHTML = document.getElementById('ifrm').contentWindow.document.getElementById('editor').innerHTML;
	    alert($("#textBodyInputId").val());
	    if ( editorHTML != $('#textBodyInputId').val() ) {
		$("#textBodyInputId").val(editorHTML);
		alert("Saved.");
		return true;
	    }
	    else {
		alert("Nothing new to save.");
		return false;
	    }
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
	    font_size = $('#font_select_id option:selected').text();
	    var node = idoc.getSelection().anchorNode;
	    if (idoc.getSelection() == node.textContent ) {
		alert('all');
		var range = idoc.getSelection().getRangeAt(0);
		var rangeAncestor = range.commonAncestorContainer;
		alert(rangeAncestor.textContent);
		var startRange = range.startContainer;
		var thisNode = document.getElementById('ifrm').contentWindow.document.getElementById(startRange.parentNode.id);
		thisNode.style.fontSize = font_size.trim() + "px";
	    }
	    else {
		alert('not all');
		var range = idoc.getSelection().getRangeAt(0);
		var rangeAncestor = range.commonAncestorContainer;
		alert(rangeAncestor.textContent);
		var startRange = range.startContainer;
		alert(startRange.parentNode.id);
		var containingNodeID = startRange.parentNode.id;
		var parNode = document.getElementById('ifrm').contentWindow.document.getElementById(containingNodeID);
		var curText = parNode.textContent;
		var addText = curText.substring(range.startOffset, range.endOffset+1);
		var nextID = "";
		var newSpan = null;
		// Can safely make the new element a sibling
		if ( range.endOffset == curText.length ) {
		    alert('woot');
		    newSpan = document.createElement('span');
		    // Check if this element has a tilda in its id.
		    if ( parNode.id.split('~').length - 1 ) {
			var parNodeIdList = parNode.id.split('.');
			// Top-level element
			if ( parNodeIdList.length == 1 ) {
			    var idNumber = parNodeIdList.replace(/\D+/,'');
			    alert('idNumber: '+idNumber);
			    var idNumInt = parseInt(idNumber);
			    alert('idNumInt: '+idNumInt);
			    nextID = containingNodeID + ++idNumInt;
			}
			// Sub-level element
			else {
			    // Get the last section of numbers
			    var idNumber = parNodeIdList[parNodeIdList.length - 1].replace(/\D+/,'');
			    alert('idNumber: '+idNumber);
			    var idNumInt = parseInt(idNumber);
			    alert('idNumInt: '+idNumInt);
			    nextID = containingNodeID + ++idNumInt;
			}
		    }
		    // Parent has no number in the id. Must put one in the id.
		    else {
			nextID = containingNodeID + '1';
		    }
		    curText = curText.substring(0,range.startOffset);
		    parNode.textContent = curText;
		    var editor = document.getElementById('ifrm').contentWindow.document.getElementById(containingNodeID).parentNode;
		    //editor.appendChild(newSpan);
		    var htmlToInsert = '<span id="insertID">TEXT</span>';
		    htmlToInsert = htmlToInsert.replace(/insertID/,nextID);
		    htmlToInsert = htmlToInsert.replace(/TEXT/,addText);
		    parNode.insertAdjacentHTML('afterend',htmlToInsert);
		}
		else {
		    // Make the new element a child of the current element
		    // id is notation containingNodeID.countInsideElement
		    nextID = containingNodeID+'.'+count++;
		}
		newSpan.setAttribute("id",nextID);
		newSpan.textContent = addText;
		newSpan.style.fontSize.replace("px",font_size);
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