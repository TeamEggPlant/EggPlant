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

    Controller.prototype.addQuestion = function(selector, title, text, tags, categoryId) {
        var _this = this;

        var questionValidator = app.validator.load();
        questionValidator.setRules({
            'title': {
                required: true,
                minlength: 4,
                maxlength: 50
            },
            'text': {
                required: true,
                minlength: 6
            },
            'tags': {
                required: true,
                minlength: 2,
                regex: /^([^\s,_-][a-z0-9\s,_-]+)$/
            }
        })
        .setErrorMessages({
            'title': {
                required: 'Please enter title!',
                minlength: 'Your title must be at least 4 characters long!',
                maxlength: 'Your title must be less than 50 characters long!'
            },
            'text': {
                required: 'Please enter question!',
                minlength: 'Your question must be at least 6 characters long!'
            },
            'tags': {
                required: 'Please enter tags!',
                minlength: 'Your tags must be at least 2 characters long!',
                regex: 'Your tags can only contain english letters, numbers, slashes(_) and dashes(-)!'
            }
        })
        .setData({
            'title': title,
            'text': text,
            'tags': tags
        })
        .validate();

        var validQuestion = questionValidator.isValid();
        if (validQuestion) {
            /*this._model.loginUser(username, password)
                .then(function(data) {
                    sessionStorage['logged-in'] = data.sessionToken;
                    sessionStorage['username'] = username;
                    sessionStorage['userId'] = data.objectId;

                    window.location = '#/';
                }, function(error) {
                    var outputData = {
                        'errorMessages' : [
                            { 'message' : error.responseJSON.error }
                        ],
                        'username' : username,
                        'password' : password
                    };

                    app.loginView.render(_this, selector, outputData);
                }
            );*/
            var questionData = {
                'title': title,
                'text': text,
                'views' : 1,
                'categoryId': {
                    '__type': 'Pointer',
                    'className': 'Category',
                    'objectId': categoryId
                },
                'creator': {
                    '__type': 'Pointer',
                    'className': '_User',
                    'objectId': sessionStorage['userId']
                }
            };

            this._model.addQuestion(questionData)
                .then(function(data) {
                    // TODO: add these object tags to DB

                    var tagsData = [];
                    var splitTags = tags.split(',');

                    for (var tagIndex in splitTags) {
                        var currentTag = {
                            'name' : splitTags[tagIndex].trim(),
                            'questionId' : data.objectId
                        };

                        tagsData.push(currentTag);
                    }

                    _this._model.addQuestionTags(tagsData)
                        .then(function(data) {
                            console.log(data);
                        }, function(error) {
                            console.log(error.responseText);
                        });

                    //console.log(tagsData);


                    //var postId = data.objectId;

                    //window.location = '#/view-post/' + postId;
                }, function(error) {
                    console.log(error.responseText);
                });
        }
        else {
            var outputData = questionValidator.getErrorMessages();
            outputData.title = title;
            outputData.text = text;
            outputData.tags = tags;

            app.askQuestionView.render(this, selector, outputData);
        }
    };

    Controller.prototype.loadQuestion = function(selector, objectId) {
        var _this = this;
        var incrementData = { 'views' : { '__op' : 'Increment', 'amount' : 1 } };

        Q.all([
            this._model.getQuestion(objectId),
            this._model.getQuestionAnswers(objectId),
            this._model.incrementQuestionViews(objectId, incrementData)
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
                answers : questionAnswersData,
                views : question['views']
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
        app.askQuestionView.render(this, selector);
    };

    return {
        load: function(model) {
            return new Controller(model);
        }
    }
}());