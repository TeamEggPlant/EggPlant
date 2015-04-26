var app = app || {};

app.loginController = (function() {
    function Controller(model) {
        this._model = model;
    }

    Controller.prototype.loadLoginPage = function(selector) {
        app.loginView.render(this, selector);
    };

    Controller.prototype.login = function(selector, username, password) {
        this._model.loginUser(username, password)
            .then(function(data) {
                sessionStorage['logged-in'] = data.sessionToken;

                app.setActivePage('home-page');
                app.homeView.render(this, selector);
            }, function(error) {
                var errorMessage = error.responseJSON.error;

                console.log(errorMessage);
            }
        );
    };

    return {
        load: function(model) {
            return new Controller(model);
        }
    }
}());