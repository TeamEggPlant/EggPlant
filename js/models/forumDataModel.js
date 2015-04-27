var app = app || {};

app.forumDataModel = (function() {
    function ForumDataModel(baseUrl, requester, headers, serviceClass) {
        this._requester = requester;
        this._headers = headers;
        this._serviceUrl = baseUrl + 'classes/' + serviceClass;
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

    ForumDataModel.prototype.addQuestion = function(data) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.post(this._serviceUrl, headers, data));

        return deffer.promise;
    };

    return {
        load: function(baseUrl, requester, headers, serviceClass) {
            return new ForumDataModel(baseUrl, requester, headers, serviceClass);
        }
    }
}());