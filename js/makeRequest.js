var app = app || {};

(function(scope) {
    var MakeRequest = function MakeRequest(method, url, data, successCallback, errorCallback) {
        $.ajax({
            method: method,
            headers:{
                'X-Parse-Application-Id' : 'hApEEqQtk4HmOcjdrqSbnZb3QyjBlAgk9my5J6uB',
                'X-Parse-REST-API-Key' : 'x0k6pDLh7MNU1NAZzVNRpVrApDjIwAQ41C64GNSi',
                'X-Parse-Session-Token' : sessionStorage.sessionToken
            },
            url: url,
            data: data
        })
		.success(successCallback)
		.error(errorCallback)
    };

    scope.makeRequest = MakeRequest;
}(app));