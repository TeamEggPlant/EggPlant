var app = app || {};

app.newAnswerView = (function() {
    function render(selector, data) {
        $.get('templates/new-answer.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).prepend(output);
        })
    }

    return {
        render: function(selector, data) {
            return render(selector, data);
        }
    }
}());