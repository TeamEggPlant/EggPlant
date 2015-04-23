var app = app || {};

(function (scope) {
	var AddEventListeners = function AddEventListeners() {
		$('a#login-form-button').click(function(e) {
			$('#login-form-dialog').dialog('open');
			e.preventDefault();
		});
		
		$('a#register-form-button').click(function(e) {
			$('#register-form-dialog').dialog('open');
			e.preventDefault();
		});
		
		$('#login-form').on('submit', function(e) {
			var username = $('#login-username').val();
			var password = $('#login-password').val();
			
			console.log(username);
			console.log(password);
			
			e.preventDefault();
		});
		
		$('#register-form').on('submit', function(e) {
			var username = $('#register-username').val();
			var password = $('#register-password').val();
			var confirmPassword = $('#register-confirm-password').val();
			var email = $('#register-email').val();
			
			console.log(username);
			console.log(password);
			console.log(confirmPassword);
			console.log(email);
			
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
	}
	
	scope.addEventListeners = AddEventListeners;
}(app));