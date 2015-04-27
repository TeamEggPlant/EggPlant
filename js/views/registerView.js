var app = app || {};

app.registerView = (function() {
    function render(controller, selector, data) {
        $.get('templates/register.html', function(template) {
            var output = Mustache.render(template, data);

            $(selector).html(output);
        })
            .then(function() {
                $('#register').click(function() {
                    var registerUsername = $('#register-username').val();
                    var registerPassword = $('#register-password').val();
                    var registerRepeatPassword = $('#register-repeat-password').val();
                    var registerEmail = $('#register-email').val();

                    controller.register('#wrapper', registerUsername, registerPassword, registerRepeatPassword, registerEmail);
                })
            });
    }

    return {
        render: function(controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());