var app = app || {};

app.navigationController = (function() {
    function Controller(model) {
        this._model = model;
    }

    Controller.prototype.loadNavigationMenu = function(selector, activePage) {
        if (!sessionStorage['logged-in'] || !sessionStorage['userId'] || !sessionStorage['username']) {
            app.menuView.render(selector, 'not-logged', activePage);
        }
        else {
            app.menuView.render(selector, 'logged', activePage);
        }
    };

    return {
        load: function(model) {
            return new Controller(model);
        }
    }
}());