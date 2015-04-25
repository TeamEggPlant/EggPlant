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

        this.get('#ask-question',function(){
            controller.getAskQuestionPage(selector);
        });

        this.post('#/post-question/auth',function(context){
           var formData = this.params;
            if(!isQuestionValid(formData)){
                return;
            }
           controller.postQuestion(formData);

        });

        this.post('#/login/auth', function(context) {
            var formData = this.params;
            console.log('Login form submitted');

            //TODO: valdiate login form

            return false;
        });

        this.post('#/register/auth', function(context) {
            var formData = this.params;
            console.log('Register form submitted');

            //TODO: valdiate register form

            return false;
        });
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