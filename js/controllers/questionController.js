var app = app || {};

app.questionController = (function() {
    function Controller(model) {
        this._model = model;
    }

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

            var outputData = {
                questions : questionsData,
                categories : categoriesData,
                tags : _this._model.formatTags(tagsData)
            };
            _this._model.formatQuestions(outputData, tagsData);

            app.homeView.render(_this, selector, outputData);
        }, function(error) {
            console.log(error);
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
                    console.log(error.responseText);
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

                        for (var tagIndex in splitTags) {
                            var currentTag = {
                                'name': splitTags[tagIndex].trim(),
                                'questionId': {
                                    '__type': 'Pointer',
                                    'className': 'Question',
                                    'objectId': data.objectId
                                }
                            };

                            tagsData.tags.push(currentTag);
                        }

                        _this._model.addQuestionTags(tagsData)
                            .then(function (tagsData) {
                                window.location = '#/view-post/' + data.objectId;
                            }, function (error) {
                                console.log(error.responseText);
                            });
                    }, function (error) {
                        console.log(error.responseText);
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

                        console.log(outputData);
                        app.askQuestionView.render(_this, selector, outputData);
                    }, function (error) {
                        console.log(error.responseText);
                    });
            }
        }
    };

    Controller.prototype.loadAskQuestionPage = function(selector) {
        var _this = this;

        this._model.getAllCategories()
            .then(function (categoriesData) {
                var categories = {'categories': categoriesData.results};

                app.askQuestionView.render(_this, selector, categories);
            }, function (error) {
                console.log(error.responseText);
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
        ]).then(function(questionData){
            var question = questionData[0];
            var questionAnswersData = questionData[1].results;
            var questionTagsData = questionData[2].results;
            var questionTags = '';

            for (var answerIndex in questionAnswersData) {
                questionAnswersData[answerIndex]['authorUsername'] = questionAnswersData[answerIndex]['creator']['username'];
                questionAnswersData[answerIndex]['authorUserId'] = questionAnswersData[answerIndex]['creator']['objectId'];
            }

            for (var tagIndex in questionTagsData) {
                questionTags += questionTagsData[tagIndex]['name'] + ', ';
            }
            questionTags = questionTags.substring(0, questionTags.length - 2);

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
                tags: questionTags,
                views : questionData[3].views
            };

            app.questionView.render(_this, selector, outputData);
        },
        function(error) {
            console.log(error);
        });
    };

    Controller.prototype.addComment = function(selector, commentData) {
        var _this = this;

        if (!sessionStorage['logged-in'] || !sessionStorage['userId'] || !sessionStorage['username']) {
            var outputData = {
                'errorMessages' : [
                    {
                        'message' : 'Please login in order to comment!'
                    }
                ]
            }
            outputData.answer = commentData.answerBody;
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

                        app.errorView.render('#error-holder', {});
                        app.newAnswerView.render('#answers-holder', outputData);
                    }, function(error) {
                        console.log(error.responseText);
                    });
            }
            else {
                var outputData = answerValidator.getErrorMessages();
                outputData.error = outputData.errorMessages[0].message;
                outputData.answer = commentData.answerBody;
                console.log(outputData);

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