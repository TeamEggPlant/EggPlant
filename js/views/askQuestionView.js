/**
 * Created by User on 25/04/2015.
 */
var app = app || {};

app.askQuestionView = (function() {
    function QuestionView(selector, data) {
        $.get('templates/ask-question.html', function(template) {
            var output = Mustache.render(template);

            $(selector).html(output);
        })
    }

    return {
        load: function (selector, data) {
            return QuestionView(selector, data);
        }
    }
}());