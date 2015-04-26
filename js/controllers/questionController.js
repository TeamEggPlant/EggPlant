var app = app || {};

app.questionController = (function() {
    function Controller(model) {
        this._model = model;
    }

    Controller.prototype.loadQuestions = function(selector) {
        var _this = this;
        this._model.getHomeView()
            .then(function(questionsData) {
                var outputData = {
                    questions : questionsData.results
                };

                app.homeView.render(_this, selector, outputData);
            }, function(error) {
                console.log(error.responseText);
            })
    };

    Controller.prototype.loadQuestion = function(selector, data, objectId) {
        var _this = this;
        this._model.getHomeView()
            .then(function(questionData) {
                for (var question in data['questions']) {
                    if (question['objectId'] == objectId) {
                        var outputData = {
                            title : question['title'],
                            text : question['text'],
                            categoryId : question['categoryId']['objectId']
                        };
                    }
                }

                app.questionView.render(selector, outputData);
            })
    };

    Controller.prototype.addQuestion = function(selector, questionTitle, questionText, questionCategoryId) {
        var question = {
            title : questionTitle,
            text : questionText,
            categoryId : questionCategoryId
        };

        this._model.addQuestion(question)
            .then(function() {
                app.askedQuestionView.render(selector, question);
            }, function(error) {
                console.log(error.responseText);
            }
        )
    };

    //Controller.prototype.loadLoginPage = function(selector) {
    //    var _this = this;
    //    //this._model.get
    //};
    //Controller.prototype.getLoginPage = function (selector) {
    //    app.loginView.load(selector);
    //};
    //
    //Controller.prototype.getRegisterPage = function (selector) {
    //    app.registerView.load(selector);
    //};
    //
    //Controller.prototype.getAboutPage = function (selector) {
    //    app.aboutUsView.load(selector);
    //};
    //
    Controller.prototype.loadAskQuestionPage = function(selector){
        app.askQuestionView.render(this, selector);
    };

    //Controller.prototype.postQuestion = function(data){
    //    var data_ = {};
    //    var categoryObject = {};
    //    data_.title = data.title;
    //    data_.text = data.question;
    //    categoryObject.__type = "Pointer";
    //    categoryObject.className = "Category";
    //    categoryObject.objectId = data.category;
    //    data_.categoryId = categoryObject;
    //    app.requester.load('https://api.parse.com/1/classes').post('/Question',data_);
    //};

    return {
        load: function(model) {
            return new Controller(model);
        }
    }
}());