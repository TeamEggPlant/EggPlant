var app = app || {};

app.forumAuthModel = (function() {
    function ForumAuthModel(baseUrl, requester, headers) {
        this._requester = requester;
        this._headers = headers;
        this._serviceUrl = baseUrl + 'login';
    }

    ForumAuthModel.prototype.loginUser = function(username, password) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.login(this._serviceUrl, headers, username, password));

        return deffer.promise;
    };

    return {
        load: function(baseUrl, requester, headers, serviceClass) {
            return new ForumAuthModel(baseUrl, requester, headers, serviceClass);
        }
    }
}());