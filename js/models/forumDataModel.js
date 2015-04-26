var app = app || {};

app.forumDataModel = (function() {
    function ForumDataModel(baseUrl, requester, headers, serviceClass) {
        this._requester = requester;
        this._headers = headers;
        this._serviceUrl = baseUrl + 'clsses/' + serviceClass;
    }

    ForumDataModel.prototype.getHomeView = function () {
        var headers = this._headers.getHeaders();

        return this._requester.get(this._serviceUrl, headers)
    };
    //ForumDataModel.prototype.getStudents = function () {
    //    var headers = this._headers.getHeaders();
    //
    //    return this._requester.get(this._serviceUrl, headers);
    //};


    return {
        load: function(baseUrl, requester, headers) {
            return new ForumDataModel(baseUrl, requester, headers);
        }
    }
}());