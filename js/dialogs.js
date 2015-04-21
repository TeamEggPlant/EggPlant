$(function() {
	$('a[href*=login]').click(function(e) {
		$('#login-form-dialog').dialog('open');
		e.preventDefault();
	});
	
	$('a[href*=register]').click(function(e) {
		$('#register-form-dialog').dialog('open');
		e.preventDefault();
	});

	$('#login-form-dialog').dialog({
		autoOpen: false,
		modal: true,
		resizable: false,
		draggable: true
	});

	$('#register-form-dialog').dialog({
		autoOpen: false,
		modal: true,
		resizable: false,
		draggable: true
	});
});