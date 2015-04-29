var app = app || {};

app.cookies = (function() {
    function Cookies() {
    }

    Cookies.prototype.set = function (key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    };

    Cookies.prototype.get = function (key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    };

    return {
        load: function () {
            return new Cookies();
        }
    }
}());