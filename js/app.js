var app = app || {};

(function () {
    var apiURL = 'https://api.parse.com/1/';
	var apiId = 'hApEEqQtk4HmOcjdrqSbnZb3QyjBlAgk9my5J6uB';
	var restAPIKey = 'x0k6pDLh7MNU1NAZzVNRpVrApDjIwAQ41C64GNSi';

	var headers = app.headers.load(apiId, restAPIKey);
	var requester = app.requester.load();
    var cookies = app.cookies.load();

	var dataModel = app.forumDataModel.load(apiURL, requester, headers, 'Question/');
	var authModel = app.forumAuthModel.load(apiURL, requester, headers);
	var rankingModel = app.forumAuthModel.load(apiURL, requester, headers);

	var questionController = app.questionController.load(dataModel);
	var authController = app.authController.load(authModel, cookies);
    var rankingController = app.rankingController.load(dataModel);
	var navigationController = app.navigationController.load(null);

    app.router = Sammy(function () {
        var selector = '#wrapper';

        this.get('#/', function () {
            app.loadNavigationMenu('home-page');

            questionController.loadQuestions(selector);
        });

        this.get('#/view-post/:id', function() {
            app.loadNavigationMenu('home-page');

            var postId = this.params['id'];
            questionController.loadQuestion('#wrapper', postId);
        });

        this.get('#/category/:id', function() {
            app.loadNavigationMenu('home-page');

            var categoryId = this.params['id'];
            questionController.loadQuestions('#wrapper', { 'category' : categoryId });
        });

        this.get('#/user/:id', function() {
            app.loadNavigationMenu('home-page');

            var userId = this.params['id'];
            questionController.loadQuestions('#wrapper', { 'user' : userId });
        });

        this.get('#/login', function () {
            app.loadNavigationMenu('login-page');

            authController.loadLoginPage(selector);
        });

        this.get('#/logout', function () {
            authController.logout();
        });

        this.get('#/register', function () {
            app.loadNavigationMenu('register-page');

            authController.loadRegisterPage(selector);
        });

        this.get('#/ask-question', function() {
            app.loadNavigationMenu('ask-question-page');

            questionController.loadAskQuestionPage(selector);
        });

        this.get('#/ranking', function() {
            app.loadNavigationMenu('ranking-page');

            rankingController.loadRankingPage(selector);
        });

        this.notFound = function() {
            window.location = '#/';
        }
    });

    app.loadNavigationMenu = function loadNavigationMenu(activePage) {
        navigationController.loadNavigationMenu('#forum-menu', activePage);
    };

    app.router.run('#/');
}());