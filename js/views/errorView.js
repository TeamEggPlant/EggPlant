var app = app || {};

app.errorView = (function() {
    function render(selector, data) {
        $.get('templates/error.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }

    return {
        render: function(selector, data) {
            return render(selector, data);
        }
    }
}());