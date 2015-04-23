var app = app || {};

app.controller = (function() {
    function Controller() {
	
    }

    Controller.prototype.getHomePage = function (selector) {
        app.homeView.load(selector);
    };

    Controller.prototype.getLoginPage = function (selector) {
        app.loginView.load(selector);
    };

    Controller.prototype.getRegisterPage = function (selector) {
        app.registerView.load(selector);
    };

    return {
        load: function () {
            return new Controller();
        }
    }
}());