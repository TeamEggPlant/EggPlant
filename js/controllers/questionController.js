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

                console.log(outputData);

                app.homeView.render(_this, selector, outputData);
            }, function(error) {
                console.log(error.responseText);
            })
    };

    Controller.prototype.loadQuestion = function(selector, objectId) {
        var _this = this;

        this._model.getQuestion(objectId)
            .then(function(questionData) {
                console.log(questionData);
                var outputData = {
                    objectId : questionData['objectId'],
                    title : questionData['title'],
                    text : questionData['text'],
                    categoryId : questionData['categoryId']['objectId'],
                    categoryName : questionData['categoryId']['categoryName'],
                    authorId : questionData['creator']['objectId'],
                    authorName : questionData['creator']['username'],
                    createdAt : questionData['createdAt']
                };

                app.questionView.render(selector, outputData);
            },
            function(error) {
                console.log(error);
            })
    };

    Controller.prototype.addQuestion = function(selector, questionData) {
        this._model.addQuestion(questionData)
            .then(function(data) {
                var postId = data.objectId;

                Controller.prototype.loadQuestion(selector, postId);
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