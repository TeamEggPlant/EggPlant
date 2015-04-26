var app = app || {};

app.forumDataModel = (function() {
    function ForumDataModel(baseUrl, requester, headers, serviceClass) {
        this._requester = requester;
        this._headers = headers;
        this._serviceUrl = baseUrl + 'classes/' + serviceClass;
    }

    ForumDataModel.prototype.getHomeView = function () {
        var headers = this._headers.getHeaders();

        return this._requester.get(this._serviceUrl, headers)
    };

    return {
        load: function(baseUrl, requester, headers, serviceClass) {
            return new ForumDataModel(baseUrl, requester, headers, serviceClass);
        }
    }
}());