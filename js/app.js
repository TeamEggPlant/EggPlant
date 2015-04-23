var app = app || {};

(function () {
    var controller = app.controller.load(null);

    app.router = Sammy(function () {
        var selector = '#wrapper';

        this.get('#/', function () {
            controller.getHomePage(selector);
            setActivePage('home-page');
        });

        this.get('#/login', function () {
            controller.getLoginPage(selector);
            setActivePage('login-page');
        });

        this.get('#/register', function () {
            controller.getRegisterPage(selector);
            setActivePage('register-page');
        });

        this.get('#/about', function () {
            controller.getAboutPage(selector);
            setActivePage('about-page');
        });
    });

    var setActivePage = function setActivePage(pageId) {
        $('.nav').find('li').each(function () {
            $(this).removeClass('active');
        });
        $('li#' + pageId).addClass('active');
    }

    app.router.run('#/');
	
}());