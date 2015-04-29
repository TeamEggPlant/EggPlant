var app = app || {};

app.questionController = (function() {
    function Controller(model) {
        this._model = model;
    }

    Controller.prototype.loadAskQuestionPage = function(selector) {
        var _this = this;

        this._model.getAllCategories()
            .then(function (categoriesData) {
                var categories = { 'categories': categoriesData.results };

                app.askQuestionView.render(_this, selector, categories);
            }, function (error) {
                $.notify(error.responseJSON.error, {position: 'top center'});
            });
    };

    Controller.prototype.loadQuestion = function(selector, objectId) {
        var _this = this;
        var incrementData = { 'views' : { '__op' : 'Increment', 'amount' : 1 } };

        Q.all([
            this._model.getQuestion(objectId),
            this._model.getQuestionAnswers(objectId),
            this._model.getQuestionTags(objectId),
            this._model.incrementQuestionViews(objectId, incrementData)
        ]).then(function(data){
                var questionData = data[0];
                var questionAnswersData = data[1].results;
                var questionTagsData = data[2].results;
                var questionViewsData = data[3];
                var outputData = _this._model.formatQuestion(questionData, questionAnswersData, questionTagsData, questionViewsData);

                app.questionView.render(_this, selector, outputData);
            },
            function(error) {
                $.notify(error.responseJSON.error, {position: 'top center'});
            });
    };

    Controller.prototype.loadQuestions = function(selector, options) {
        var _this = this;

        Q.all([
            this._model.getAllQuestions(options),
            this._model.getAllCategories(),
            this._model.getAllTags(),
        ]).then(function(data) {
            var questionsData = data[0].results;
            var categoriesData = data[1].results;
            var tagsData = data[2].results;
            var outputData = _this._model.formatQuestions(questionsData, categoriesData, tagsData);

            app.homeView.render(_this, selector, outputData);
        }, function(error) {
            $.notify(error.responseJSON.error, {position: 'top center'});
        });
    };

    Controller.prototype.loadSearchQuestions = function(selector, searchValue) {
        var _this = this;

        Q.all([
            this._model.getAllQuestions(),
            this._model.getAllCategories(),
            this._model.getAllAnswers(),
            this._model.getAllTags(),
        ]).then(function(data) {
            var questionsData = data[0].results;
            var categoriesData = data[1].results;
            var answersData = data[2].results;
            var tagsData = data[3].results;
            var matchedQuestions = _this._model.extractMatchedQuestions(questionsData, answersData, tagsData, searchValue);
            var outputData = _this._model.formatQuestions(matchedQuestions, categoriesData, tagsData);

            app.homeView.render(_this, selector, outputData);
        }, function(error) {
            $.notify(error.responseJSON.error, {position: 'top center'});
        });
    };

    Controller.prototype.addQuestion = function(selector, title, text, tags, categoryId) {
        var _this = this;

        if (!sessionStorage['logged-in'] || !sessionStorage['userId'] || !sessionStorage['username']) {
            this._model.getAllCategories()
                .then(function(categoriesData) {
                    var outputData = {
                        'errorMessages' : [
                            {
                                'message' : 'Please login in order to ask question!'
                            }
                        ]
                    }
                    outputData.title = title;
                    outputData.text = text;
                    outputData.tags = tags;
                    outputData.categories = categoriesData.results;

                    app.askQuestionView.render(_this, selector, outputData);
                }, function(error) {
                    $.notify(error.responseJSON.error, {position: 'top center'});
                });
        }
        else {
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
                var questionData = {
                    'title': title,
                    'text': text,
                    'views': 0,
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
                    .then(function (data) {
                        var tagsData = {'tags': []};
                        var splitTags = tags.split(',');
                        var usedTags = {};

                        for (var tagIndex in splitTags) {
                            var currentTagName = splitTags[tagIndex].trim();

                            if (usedTags[currentTagName] === undefined) {
                                var currentTag = {
                                    'name': splitTags[tagIndex].trim(),
                                    'questionId': {
                                        '__type': 'Pointer',
                                        'className': 'Question',
                                        'objectId': data.objectId
                                    }
                                };

                                tagsData.tags.push(currentTag);
                                usedTags[currentTagName] = true;
                            }
                        }

                        _this._model.addQuestionTags(tagsData)
                            .then(function (tagsData) {
                                window.location = '#/view-post/' + data.objectId;
                            }, function (error) {
                                $.notify(error.responseJSON.error, {position: 'top center'});
                            });
                    }, function (error) {
                        $.notify(error.responseJSON.error, {position: 'top center'});
                    });
            }
            else {
                this._model.getAllCategories()
                    .then(function (categoriesData) {
                        var outputData = questionValidator.getErrorMessages();
                        outputData.title = title;
                        outputData.text = text;
                        outputData.tags = tags;
                        outputData.categories = categoriesData.results;

                        app.askQuestionView.render(_this, selector, outputData);
                    }, function (error) {
                        $.notify(error.responseJSON.error, {position: 'top center'});
                    });
            }
        }
    };

    Controller.prototype.addComment = function(selector, questionId, answerBody) {
        var _this = this;

        var answerData = {
            answerBody: answerBody,
            questionId: {
                '__type': 'Pointer',
                'className': 'Question',
                'objectId': questionId
            },
            creator: {
                '__type': 'Pointer',
                'className': '_User',
                'objectId': sessionStorage['userId']
            }
        };

        if (!sessionStorage['logged-in'] || !sessionStorage['userId'] || !sessionStorage['username']) {
            var outputData = {
                'errorMessages' : [
                    {
                        'message' : 'Please login in order to comment!'
                    }
                ]
            };
            outputData.answer = answerData.answerBody;
            outputData.error = 'Please login in order to comment!';

            app.errorView.render('#error-holder', outputData);
        }
        else {
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
                    'answer': answerData.answerBody
                })
                .validate();

            var validAnswer = answerValidator.isValid();
            if (validAnswer) {
                this._model.addComment(answerData)
                    .then(function(data) {
                        var outputData = {
                            answerBody : answerData.answerBody,
                            authorUserId : sessionStorage['userId'],
                            authorUsername : sessionStorage['username'],
                            createdAt : data.createdAt
                        };

                        app.errorView.render('#error-holder', {});
                        app.newAnswerView.render('#answers-holder', outputData);
                    }, function(error) {
                        $.notify(error.responseJSON.error, {position: 'top center'});
                    });
            }
            else {
                var outputData = answerValidator.getErrorMessages();
                outputData.error = outputData.errorMessages[0].message;
                outputData.answer = answerData.answerBody;

                app.errorView.render('#error-holder', outputData);
            }
        }
    };

    return {
        load: function(model) {
            return new Controller(model);
        }
    }
}());