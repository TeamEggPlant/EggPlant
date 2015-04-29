var app = app || {};

app.forumDataModel = (function() {
    function ForumDataModel(baseUrl, requester, headers, serviceClass) {
        this._requester = requester;
        this._headers = headers;
        this._serviceUrl = baseUrl + 'classes/' + serviceClass;
        this._baseUrl = baseUrl;
    }

    ForumDataModel.prototype.getAllQuestions = function(options) {
        var headers = this._headers.getHeaders();
        var urlOptions = '?include=categoryId,creator&order=-createdAt';

        if (options !== undefined && options.category !== undefined) {
            urlOptions += '&where={"categoryId":{"__type":"Pointer","className":"Category","objectId":"' + options.category + '"}}';
        }
        else if (options !== undefined && options.user !== undefined) {
            urlOptions += '&where={"creator":{"__type":"Pointer","className":"_User","objectId":"' + options.user + '"}}'
        }

        return this._requester.get(this._serviceUrl + urlOptions, headers);
    };

    ForumDataModel.prototype.getAllAnswers = function() {
        var headers = this._headers.getHeaders();

        return this._requester.get(this._baseUrl + 'classes/Answer?include=questionId,questionId.categoryId,questionId.creator,creator', headers);
    };

    ForumDataModel.prototype.getAllCategories = function() {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.get(this._baseUrl  + 'classes/Category', headers));

        return deffer.promise;
    };

    ForumDataModel.prototype.getAllTags = function() {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.get(this._baseUrl  + 'classes/Tag?include=questionId,questionId.categoryId,questionId.creator', headers));

        return deffer.promise;
    };

    ForumDataModel.prototype.getQuestion = function(questionId) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.get(this._serviceUrl + questionId + '?include=categoryId,creator', headers));

        return deffer.promise;
    };

    ForumDataModel.prototype.getQuestionAnswers = function(questionId) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.get(this._baseUrl  + 'classes/Answer/?where={"questionId":{"$inQuery":{"where":{"objectId":"' + questionId + '"},"className":"Question"}}}&include=creator&order=-createdAt', headers));

        return deffer.promise;
    };

    ForumDataModel.prototype.getQuestionTags = function(questionId) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.get(this._baseUrl  + 'classes/Tag/?where={"questionId":{"$inQuery":{"where":{"objectId":"' + questionId + '"},"className":"Question"}}}', headers));

        return deffer.promise;
    };

    ForumDataModel.prototype.addQuestion = function(data) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.post(this._serviceUrl, headers, data));

        return deffer.promise;
    };

    ForumDataModel.prototype.addQuestionTags = function(data) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.post(this._baseUrl + 'functions/addQuestionTags/', headers, data));

        return deffer.promise;
    };

    ForumDataModel.prototype.incrementQuestionViews = function(objectId, data) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.put(this._serviceUrl + objectId, headers, data));

        return deffer.promise;
    };

    ForumDataModel.prototype.addComment = function(data) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.post(this._baseUrl + 'classes/Answer/', headers, data));

        return deffer.promise;
    };

    ForumDataModel.prototype.formatQuestion = function(questionData, questionAnswersData, questionTagsData, questionViewsData) {
        // add answers to question
        for (var answerIndex in questionAnswersData) {
            questionAnswersData[answerIndex]['authorUsername'] = questionAnswersData[answerIndex]['creator']['username'];
            questionAnswersData[answerIndex]['authorUserId'] = questionAnswersData[answerIndex]['creator']['objectId'];
        }

        // add tags to question

        var questionTags = '';
        for (var tagIndex in questionTagsData) {
            questionTags += questionTagsData[tagIndex]['name'] + ', ';
        }
        questionTags = questionTags.substring(0, questionTags.length - 2);

        // format question output
        return {
            objectId : questionData['objectId'],
            title : questionData['title'],
            text : questionData['text'],
            categoryId : questionData['categoryId']['objectId'],
            categoryName : questionData['categoryId']['categoryName'],
            authorId : questionData['creator']['objectId'],
            authorName : questionData['creator']['username'],
            createdAt : ForumDataModel.prototype.formatDate(questionData['createdAt']),
            answers : questionAnswersData,
            tags: questionTags,
            views : questionViewsData.views
        };
    }

    ForumDataModel.prototype.formatQuestions = function(questionsData, categoriesData, tagsData) {
        for (var questionIndex in questionsData) {
            questionsData[questionIndex]['authorId'] = questionsData[questionIndex]['creator']['objectId'];
            questionsData[questionIndex]['authorName'] = questionsData[questionIndex]['creator']['username'];
            questionsData[questionIndex]['category'] = questionsData[questionIndex]['categoryId']['objectId'];
            questionsData[questionIndex]['categoryName'] = questionsData[questionIndex]['categoryId']['categoryName'];
            questionsData[questionIndex]['tags'] = '';
            questionsData[questionIndex]['createdAt'] = ForumDataModel.prototype.formatDate(questionsData[questionIndex]['createdAt']);

            tagsData.filter(function(obj) {
                if (obj.questionId.objectId === questionsData[questionIndex].objectId) {
                    questionsData[questionIndex]['tags'] += obj.name + ', ';
                }
            });
            questionsData[questionIndex]['tags'] = questionsData[questionIndex]['tags'].substring(0, questionsData[questionIndex]['tags'].length - 2);
        }

        return {
            questions : questionsData,
            categories : categoriesData,
            tags : ForumDataModel.prototype.formatTags(tagsData)
        };
    }

    ForumDataModel.prototype.formatDate = function(dateData) {
        var date = new Date(dateData);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        date = day + '-' + month + '-' + year + ', ' + hours + ':' + minutes;

        return date;
    }

    ForumDataModel.prototype.formatTags = function(data) {
        var tagsObjects = {};
        var tags = [];
        var totalTags = 0;

        for (var tagIndex in data) {
            var currentTag = data[tagIndex];

            if (tagsObjects[currentTag.name]) {
                tagsObjects[currentTag.name]['count']++;
            }
            else {
                tagsObjects[currentTag.name] = {
                    'name' : currentTag.name,
                    'count' : 1
                };
            }

            totalTags++;
        }

        for (var tagIndex in tagsObjects) {
            var pad = '00';
            tagsObjects[tagIndex].percent = Math.floor(tagsObjects[tagIndex].count / totalTags * 100) * 4;
            tagsObjects[tagIndex].percent = (pad + tagsObjects[tagIndex].percent).slice(-pad.length);
            tags.push(tagsObjects[tagIndex]);
        }

        return tags;
    }

    ForumDataModel.prototype.extractMatchedQuestions = function(questionsData, answersData, tagsData, searchValue) {
        var matchedQuestionsIds = {};
        var matchedQuestions = [];
        var searchPattern = new RegExp(searchValue, "g");

        // extract matches from questions
        for (var questionIndex in questionsData) {
            var currentQuestion = questionsData[questionIndex];
            var questionMatches = searchPattern.test(currentQuestion.title) || searchPattern.test(currentQuestion.text);

            if (questionMatches && matchedQuestionsIds[currentQuestion.objectId] === undefined) {
                matchedQuestions.push(currentQuestion);
                matchedQuestionsIds[currentQuestion.objectId] = true;
            }
        }

        // extract matches from answers
        for (var answerIndex in answersData) {
            var currentAnswer = answersData[answerIndex];
            var answerMatches = searchPattern.test(currentAnswer.answerBody);

            if (answerMatches && matchedQuestionsIds[currentAnswer.questionId.objectId] === undefined) {
                matchedQuestions.push(currentAnswer.questionId);
                matchedQuestionsIds[currentAnswer.questionId.objectId] = true;
            }
        }

        // extract matches from tags
        for (var tagIndex in tagsData) {
            var currentTag = tagsData[tagIndex];
            var tagMatches = searchPattern.test(currentTag.name);

            if (tagMatches && matchedQuestionsIds[currentTag.questionId.objectId] === undefined) {
                matchedQuestions.push(currentTag.questionId);
                matchedQuestionsIds[currentTag.questionId.objectId] = true;
            }
        }

        return matchedQuestions;
    }

    ForumDataModel.prototype.extractUsersRanking = function(questionsData, answersData) {
        var users = {};

        // extract users questions
        for (var questionIndex in questionsData) {
            var currentQuestion = questionsData[questionIndex];
            var currentQuestionCreatorId = currentQuestion.creator.objectId;
            var currentQuestionCreatorUsername = currentQuestion.creator.username;

            if (users[currentQuestionCreatorId] === undefined) {
                users[currentQuestionCreatorId] = {
                    'userId' : currentQuestionCreatorId,
                    'username' : currentQuestionCreatorUsername,
                    'questions' : 1
                }
            }
            else {
                users[currentQuestionCreatorId]['questions'] += 3;
            }
        }

        // extract users answers
        for (var answerIndex in answersData) {
            var currentAnswer = answersData[answerIndex];
            var currentAnswerCreatorId = currentAnswer.creator.objectId;
            var currentAnswerCreatorUsername = currentAnswer.creator.username;

            if (users[currentAnswerCreatorId] === undefined) {
                users[currentAnswerCreatorId] = {
                    'userId' : currentAnswerCreatorId,
                    'username' : currentAnswerCreatorUsername,
                    'questions' : 1
                }
            }
            else {
                users[currentAnswerCreatorId]['questions']++;
            }
        }

        users = Object.keys(users).map(function (key) { return users[key]; });
        users = users.sort(function(a, b) { return b.questions - a.questions; });

        return {
            'users' : users
        };
    }

    return {
        load: function(baseUrl, requester, headers, serviceClass) {
            return new ForumDataModel(baseUrl, requester, headers, serviceClass);
        }
    }
}());