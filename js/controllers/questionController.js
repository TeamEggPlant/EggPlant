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

                for (var questionIndex in outputData.questions) {
                    outputData.questions[questionIndex]['authorId'] = outputData.questions[questionIndex]['creator']['objectId'];
                    outputData.questions[questionIndex]['authorName'] = outputData.questions[questionIndex]['creator']['username'];
                    outputData.questions[questionIndex]['category'] = outputData.questions[questionIndex]['categoryId']['objectId'];
                    outputData.questions[questionIndex]['categoryName'] = outputData.questions[questionIndex]['categoryId']['categoryName'];
                }

                app.homeView.render(_this, selector, outputData);
            }, function(error) {
                console.log(error.responseText);
            });
    };

    Controller.prototype.addQuestion = function(selector, questionData) {
        this._model.addQuestion(questionData)
            .then(function(data) {
                var postId = data.objectId;

                window.location = '#/view-post/' + postId;
            }, function(error) {
                console.log(error.responseText);
            }
        )
    };

    Controller.prototype.loadQuestion = function(selector, objectId) {
        var _this = this;

        Q.all([
            this._model.getQuestion(objectId),
            this._model.getQuestionAnswers(objectId),
        ]).then(function(questionData){
            var question = questionData[0];
            var questionAnswersData = questionData[1].results;

            for (var answerIndex in questionAnswersData) {
                questionAnswersData[answerIndex]['authorUsername'] = questionAnswersData[answerIndex]['creator']['username'];
                questionAnswersData[answerIndex]['authorUserId'] = questionAnswersData[answerIndex]['creator']['objectId'];
            }

            var outputData = {
                objectId : question['objectId'],
                title : question['title'],
                text : question['text'],
                categoryId : question['categoryId']['objectId'],
                categoryName : question['categoryId']['categoryName'],
                authorId : question['creator']['objectId'],
                authorName : question['creator']['username'],
                createdAt : question['createdAt'],
                answers : questionAnswersData
            };

            app.questionView.render(_this, selector, outputData);
        },
        function(error) {
            console.log(error);
        });
    };

    Controller.prototype.addComment = function(selector, commentData) {
        var _this = this;

        var answerValidator = app.validator.load();
        answerValidator.setRules({
            'answer': {
                required: true,
                minlength: 4
            }
        })
        .setErrorMessages({
            'answer': {
                required: 'Please enter answer!',
                minlength: 'Your answer must be at least 4 characters long!'
            }
        })
        .setData({
            'answer': commentData.answerBody
        })
        .validate();

        var validAnswer = answerValidator.isValid();
        if (validAnswer) {
            this._model.addComment(commentData)
                .then(function(data) {
                    console.log();

                    var outputData = {
                        answerBody : commentData.answerBody,
                        authorUserId : sessionStorage['userId'],
                        authorUsername : sessionStorage['username'],
                        createdAt : data.createdAt
                    };

                    app.newAnswerView.render('#answers-holder', outputData);
                }, function(error) {
                    console.log(error.responseText);
                });
        }
        else {
            var outputData = answerValidator.getErrorMessages();
            outputData.error = outputData.errorMessages[0].message;
            outputData.answer = commentData.answerBody;

            app.errorView.render('#error-holder', outputData);
        }
    };

    Controller.prototype.loadAskQuestionPage = function(selector){
        console.log(this);
        app.askQuestionView.render(this, selector);
    };

    return {
        load: function(model) {
            return new Controller(model);
        }
    }
}());