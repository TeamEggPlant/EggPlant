var app = app || {};

app.loginView = (function() {
    function render(controller, selector, data) {
        $.get('templates/login.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
        .then(function() {
            $('#login').click(function() {
                // TODO: remember me functionality
                var loginUsername = $('#login-username').val();
                var loginPassword = $('#login-password').val();

                controller.login('#wrapper', loginUsername, loginPassword);
            })
        });
    }

    return {
        render: function(controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());