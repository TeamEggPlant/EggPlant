var app = app || {};

app.forumDataModel = (function() {
    function ForumDataModel(baseUrl, requester, headers, serviceClass) {
        this._requester = requester;
        this._headers = headers;
        this._serviceUrl = baseUrl + 'classes/' + serviceClass;
        this._baseUrl = baseUrl;
    }

    ForumDataModel.prototype.getHomeView = function() {
        var headers = this._headers.getHeaders();

        return this._requester.get(this._serviceUrl + '?include=categoryId,creator&order=-createdAt', headers);
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

    ForumDataModel.prototype.getAllCategories = function() {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.get(this._baseUrl  + 'classes/Category', headers));

        return deffer.promise;
    };

    ForumDataModel.prototype.getAllTags = function() {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.get(this._baseUrl  + 'classes/Tag', headers));

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

    ForumDataModel.prototype.formatQuestions = function(data, tagsData) {
        for (var questionIndex in data.questions) {
            data.questions[questionIndex]['authorId'] = data.questions[questionIndex]['creator']['objectId'];
            data.questions[questionIndex]['authorName'] = data.questions[questionIndex]['creator']['username'];
            data.questions[questionIndex]['category'] = data.questions[questionIndex]['categoryId']['objectId'];
            data.questions[questionIndex]['categoryName'] = data.questions[questionIndex]['categoryId']['categoryName'];
            data.questions[questionIndex]['tags'] = '';

            var currentTags = tagsData.filter(function(obj) {
                if (obj.questionId.objectId === data.questions[questionIndex].objectId) {
                    data.questions[questionIndex]['tags'] += obj.name + ', ';
                }
            });
            data.questions[questionIndex]['tags'] = data.questions[questionIndex]['tags'].substring(0, data.questions[questionIndex]['tags'].length - 2);
        }

        return data;
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
            //tagsObjects[tagIndex].percent = (pad + tagsObjects[tagIndex].percent).slice(-pad.length);
            tags.push(tagsObjects[tagIndex]);
        }

        return tags;
    }

    return {
        load: function(baseUrl, requester, headers, serviceClass) {
            return new ForumDataModel(baseUrl, requester, headers, serviceClass);
        }
    }
}());