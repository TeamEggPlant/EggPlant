var app = app || {};

app.questionView = (function() {
    function render(selector, data) {
        $.get('templates/question-view.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
        //TODO - add some answer functionality
    }

    return {
        render: function(selector, data) {
            return render(selector, data);
        }
    }
}());