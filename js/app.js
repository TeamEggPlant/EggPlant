var app = app || {};

(function () {
	var apiId = 'hApEEqQtk4HmOcjdrqSbnZb3QyjBlAgk9my5J6uB';
	var restAPIKey = 'x0k6pDLh7MNU1NAZzVNRpVrApDjIwAQ41C64GNSi';

	var headers = app.headers.load(apiId, restAPIKey);
	var requester = app.requester.load();
	var questionModel = app.forumDataModel.load('https://api.parse.com/1/', requester, headers, 'Question/');
	var controller = app.controller.load(questionModel);

    app.router = Sammy(function () {
        var selector = '#wrapper';

        this.get('#/', function () {
            controller.loadQuestions(selector);
            setActivePage('home-page');
        });

    //    this.get('#/login', function () {
    //        controller.getLoginPage(selector);
    //        setActivePage('login-page');
    //    });
    //
    //    this.get('#/register', function () {
    //        controller.getRegisterPage(selector);
    //        setActivePage('register-page');
    //    });
    //
    //    this.get('#/about', function () {
    //        controller.getAboutPage(selector);
    //        setActivePage('about-page');
    //    });
    //
    //    this.get('#/ask-question',function(){
    //        controller.getAskQuestionPage(selector);
    //        setActivePage('home-page');
    //    });
    //
    //    this.post('#/post-question/auth',function(context){
    //        var formData = this.params;
    //
    //        if(!isQuestionValid(formData)){
    //            return;
    //        }
    //
    //        controller.postQuestion(formData);
    //
    //        setActivePage('home-page');
    //    });
    //
    //    this.post('#/login/auth', function(context) {
    //        var formData = this.params;
    //
    //        var usernameField = formData['login-username'];
    //        var passwordField = formData['login-password'];
    //        var rememberMeField = formData['login-remember'];
    //
    //        var loginValidator = app.validator.load();
    //
    //        loginValidator.setRules({
    //            'login-username': {
    //                required: true,
    //                minlength: 4,
    //                maxlength: 25
    //            },
    //            'login-password': {
    //                required: true,
    //                minlength: 6,
    //                maxlength: 50
    //            }
    //        })
    //        .setData({
    //            'login-username': usernameField,
    //            'login-password': passwordField
    //        })
    //        .validate();
    //
    //
    //        return false;
    //    });
    //
    //    this.post('#/register/auth', function(context) {
    //        var formData = this.params;
    //        console.log('Register form submitted');
    //
    //        //TODO: valdiate register form
    //
    //        return false;
    //    });
    });

    var setActivePage = function setActivePage(pageId) {
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