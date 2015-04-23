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
			// login form validated
			if ($('#login-form').valid()) {
				var username = $('#login-username').val();
				var password = $('#login-password').val();
				
				// TODO: send login request to parse.com with AJAX
				
				// TODO: if authentication successful then log user
					$('#login-form-dialog').dialog('close');
					// TODO: set sessionStorage and reload main container with AJAX
			}
			
			e.preventDefault();
		});
		
		$('#register-form').on('submit', function(e) {
			// register form validated
			if ($('#register-form').valid()) {
				var username = $('#register-username').val();
				var password = $('#register-password').val();
				var confirmPassword = $('#register-confirm-password').val();
				var email = $('#register-email').val();
				
				// TODO: send register request to parse.com with AJAX
				
				// TODO: if register successful then log user
					$('#register-form-dialog').dialog('close');
					// TODO: set sessionStorage and reload main container with AJAX
			}
			
			e.preventDefault();
		});
		
		$('#login-form').validate({
			rules: {
				"login-username": {
					required: true,
					minlength: 4,
					maxlength: 25
				},
				"login-password": {
					required: true,
					minlength: 6,
					maxlength: 50
				}
			},
			messages: {
				"login-username": {
					required: 'Please enter username!',
					minlength: 'Your username must be at least 4 characters long',
					maxlength: 'Your username must be less than 25 characters long'
				},
				"login-password": {
					required: 'Please enter password!',
					minlength: 'Your password must be at least 6 characters long',
					maxlength: 'Your password must be less than 50 characters long'
				}
			}
		});
		
		$('#register-form').validate({
			rules: {
				'register-username': {
					required: true,
					minlength: 4,
					maxlength: 25
				},
				'register-password': {
					required: true,
					minlength: 6,
					maxlength: 50
				},
				'register-confirm-password': {
					equalTo: '#register-password'
				},
				'register-email': {
					required: true,
					email: true
				}
			},
			messages: {
				'register-username': {
					required: 'Please enter username!',
					minlength: 'Your username must be at least 4 characters long',
					maxlength: 'Your username must be less than 25 characters long'
				},
				'register-password': {
					required: 'Please enter password!',
					minlength: 'Your password must be at least 6 characters long',
					maxlength: 'Your password must be less than 50 characters long'
				},
				'register-confirm-password': {
					equalTo: 'Please enter correctly confirm password!'
				},
				'register-email': {
					required: 'Please enter email!',
					email: 'Please enter valid email!',
				}
			}
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