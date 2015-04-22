$(function() {
	$('a[href*=login]').click(function(e) {
		$('#login-form-dialog').dialog('open');
		e.preventDefault();
	});
	
	$('a[href*=register]').click(function(e) {
		$('#register-form-dialog').dialog('open');
		e.preventDefault();
	});
	
	$('#confirm-password').on('focusout',checkPassword);

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
	
	function checkPassword(){
		var password = $('#register-password').val();
		var confirmPassword = $('#confirm-password').val();
		if(password!=confirmPassword){
			$('.warning-lbl').fadeIn(100);
			return;
		}
		else{
			$('.warning-lbl').fadeOut(100);
			return;
		}
	}
});