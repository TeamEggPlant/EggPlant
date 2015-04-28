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

    return {
        load: function(baseUrl, requester, headers, serviceClass) {
            return new ForumDataModel(baseUrl, requester, headers, serviceClass);
        }
    }
}());