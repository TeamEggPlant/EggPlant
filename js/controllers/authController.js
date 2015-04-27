var app = app || {};

app.authController = (function() {
    function Controller(model) {
        this._model = model;
    }

    Controller.prototype.loadLoginPage = function(selector) {
        app.loginView.render(this, selector);
    };

    Controller.prototype.loadRegisterPage = function(selector) {
        app.registerView.render(this, selector);
    };

    Controller.prototype.login = function(selector, username, password) {
        var _this = this;

        var loginValidator = app.validator.load();
        loginValidator.setRules({
            'username': {
                required: true,
                minlength: 4,
                maxlength: 25,
                regex: /^([^_\.-][a-z0-9_\.-]{3,25})$/
            },
            'password': {
                required: true,
                minlength: 6,
                maxlength: 50
            }
        })
        .setErrorMessages({
            'username': {
                required: 'Please enter username!',
                minlength: 'Your username must be at least 4 characters long!',
                maxlength: 'Your username must be less than 25 characters long!',
                regex: 'Your username can only contain english letters, numbers, _, - and .!'
            },
            'password': {
                required: 'Please enter password!',
                minlength: 'Your password must be at least 6 characters long!',
                maxlength: 'Your password must be less than 50 characters long!'
            }
        })
        .setData({
            'username': username,
            'password': password
        })
        .validate();

        var validLogin = loginValidator.isValid();
        if (validLogin) {
            this._model.loginUser(username, password)
                .then(function(data) {
                    sessionStorage['logged-in'] = data.sessionToken;
                    sessionStorage['username'] = username;
                    sessionStorage['userId'] = data.objectId;

                    window.location = '#/';
                }, function(error) {
                    var outputData = {
                        'errorMessages' : [
                            { 'message' : error.responseJSON.error }
                        ],
                        'username' : username,
                        'password' : password
                    };

                    app.loginView.render(_this, selector, outputData);
                }
            );
        }
        else {
            var outputData = loginValidator.getErrorMessages();
            outputData.username = username;
            outputData.password = password;

            app.loginView.render(this, selector, outputData);
        }
    };

    Controller.prototype.register = function(selector, username, password, repeatPassword, email) {
        var _this = this;

        var userData = {
            'username' : username,
            'password' : password,
            'email' : email
        };

        var registerValidator = app.validator.load();
        registerValidator.setRules({
            'username': {
                required: true,
                minlength: 4,
                maxlength: 25,
                regex: /^([^_\.-][a-z0-9_\.-]{3,25})$/
            },
            'password': {
                required: true,
                minlength: 6,
                maxlength: 50
            },
            'confirm-password': {
                required: true,
                equalTo: password
            },
            'email': {
                required: true,
                email: true
            }
        })
        .setErrorMessages({
            'username': {
                required: 'Please enter username!',
                minlength: 'Your username must be at least 4 characters long!',
                maxlength: 'Your username must be less than 25 characters long!',
                regex: 'Your username can only contain english letters, numbers, _, - and .!'
            },
            'password': {
                required: 'Please enter password!',
                minlength: 'Your password must be at least 6 characters long!',
                maxlength: 'Your password must be less than 50 characters long!'
            },
            'confirm-password': {
                required: 'Please enter confirm password!',
                equalTo: 'Enter the same password!'
            },
            'email': {
                required: 'Please enter email!',
                email: 'Please enter valid email!'
            }
        })
        .setData({
            'username': username,
            'password': password,
            'confirm-password': repeatPassword,
            'email': email
        })
        .validate();

        var validRegister = registerValidator.isValid();
        if (validRegister) {
            this._model.registerUser(userData)
                .then(function(data) {
                    sessionStorage['logged-in'] = data.sessionToken;
                    sessionStorage['username'] = username;
                    sessionStorage['userId'] = data.objectId;

                    //app.setActivePage('home-page');
                    //app.homeView.render(this, selector);
                    window.location = '#/';
                }, function(error) {
                    var outputData = {
                        'errorMessages' : [
                            { 'message' : error.responseJSON.error }
                        ],
                        'username' : username,
                        'password' : password,
                        'repeatPassword' : repeatPassword,
                        'email' : email
                    };
                    console.log(outputData);

                    app.registerView.render(_this, selector, outputData);
                }
            );
        }
        else {
            var outputData = registerValidator.getErrorMessages();
            outputData.username = username;
            outputData.password = password;
            outputData.repeatPassword = repeatPassword;
            outputData.email = email;

            app.registerView.render(this, selector, outputData);
        }
    };

    return {
        load: function(model) {
            return new Controller(model);
        }
    }
}());