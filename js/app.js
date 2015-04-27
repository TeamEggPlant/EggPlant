var app = app || {};

(function () {
    var apiURL = 'https://api.parse.com/1/';
	var apiId = 'hApEEqQtk4HmOcjdrqSbnZb3QyjBlAgk9my5J6uB';
	var restAPIKey = 'x0k6pDLh7MNU1NAZzVNRpVrApDjIwAQ41C64GNSi';

	var headers = app.headers.load(apiId, restAPIKey);
	var requester = app.requester.load();
	var questionModel = app.forumDataModel.load(apiURL, requester, headers, 'Question/');
	var authModel = app.forumAuthModel.load(apiURL, requester, headers);
	var questionController = app.questionController.load(questionModel);
	var authController = app.authController.load(authModel);

    app.router = Sammy(function () {
        var selector = '#wrapper';

        this.get('#/', function () {
            questionController.loadQuestions(selector);
            app.setActivePage('home-page');
        });

        this.get('#/post', function() {
            questionController.loadQuestion(selector);
        });

        this.get('#/view-post/:id', function() {
            var postId = this.params['id'];

            questionController.loadQuestion('#wrapper', postId);
        });

        this.get('#/login', function () {
            authController.loadLoginPage(selector);
            app.setActivePage('login-page');
        });

        this.get('#/register', function () {
            authController.loadRegisterPage(selector);
            app.setActivePage('register-page');
        });

        this.get('#/ask-question', function() {
            questionController.loadAskQuestionPage(selector);
            app.setActivePage('home-page');
        });
    });

    app.setActivePage = function setActivePage(pageId) {
        $('.nav').find('li').each(function () {
            $(this).removeClass('active');
        });
        $('li#' + pageId).addClass('active');
    };

    function isQuestionValid(data){
        if(!data.question||!data.title||!data.category){
            return false;
        }
        return true;
    }

    app.router.run('#/');
}());