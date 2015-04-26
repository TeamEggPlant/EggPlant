var app = app || {};

app.askedQuestionView = (function() {
    function render(selector, data) {
        console.log('asked q');

        $.get('templates/askedQuestion.html', function(template) {
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