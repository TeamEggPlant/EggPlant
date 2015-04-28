var app = app || {};

app.forumAuthModel = (function() {
    function ForumAuthModel(baseUrl, requester, headers) {
        this._requester = requester;
        this._headers = headers;
        this._serviceUrl = baseUrl;
    }

    ForumAuthModel.prototype.loginUser = function(username, password) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        var loginParameters = '?username=' + username + '&password=' + password;
        deffer.resolve(this._requester.get(this._serviceUrl + 'login' + loginParameters, headers, username, password));

        return deffer.promise;
    };

    ForumAuthModel.prototype.registerUser = function(userData) {
        var deffer = Q.defer();
        var headers = this._headers.getHeaders();

        deffer.resolve(this._requester.post(this._serviceUrl + 'users', headers, userData));

        return deffer.promise;
    };

    return {
        load: function(baseUrl, requester, headers, serviceClass) {
            return new ForumAuthModel(baseUrl, requester, headers, serviceClass);
        }
    }
}());