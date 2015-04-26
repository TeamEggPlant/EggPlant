var app = app || {};

app.aboutUsView = (function() {
    function AboutUsView(selector, data) {
        $.get('templates/aboutUs.html', function(template) {
            var output = Mustache.render(template);

            $(selector).html(output);
        })
    }

    return {
        load: function (selector, data) {
            return AboutUsView(selector, data);
        }
    }
}());