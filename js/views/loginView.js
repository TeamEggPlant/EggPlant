var app = app || {};

app.loginView = (function() {
    function render(controller, selector, data) {
        $.get('templates/login.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
        .then(function() {
            $('#login').click(function() {
                var loginUsername = $('#login-username').val();
                var loginPassword = $('#login-password').val();
                var loginRememberMe = $('#login-remember').is(':checked');

                controller.login('#wrapper', loginUsername, loginPassword, loginRememberMe);
            })
        });
    }

    return {
        render: function(controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());