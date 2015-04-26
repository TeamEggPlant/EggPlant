var app = app || {};

app.controller = (function() {
    function Controller(model) {
	    this._model = model;
    }

    Controller.prototype.loadQuestions = function (selector) {
        var _this = this;
        this._model.getHomeView()
            .then(function (questionsData) {
                var outputData = {
                    questions : questionsData.result
                };

                app.homeView.render(_this, selector, outputData);
            }
        )
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

    Controller.prototype.getAboutPage = function (selector) {
        app.aboutUsView.load(selector);
    };

    Controller.prototype.getAskQuestionPage = function(selector){
        app.askQuestionView.load(selector);
    };
    Controller.prototype.postQuestion = function(data){
        var data_ = {};
        var categoryObject = {};
        data_.title = data.title;
        data_.text = data.question;
        categoryObject.__type = "Pointer";
        categoryObject.className = "Category";
        categoryObject.objectId = data.category;
        data_.categoryId = categoryObject;
        app.requester.load('https://api.parse.com/1/classes').post('/Question',data_);
    };

    return {
        load: function () {
            return new Controller();
        }
    }
}());