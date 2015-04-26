var app = app || {};

app.askQuestionView = (function() {
    function render(controller, selector) {
        $.get('templates/ask-question.html', function(template) {
            var output = Mustache.render(template);

            $(selector).html(output);
        })
            .then(function() {
                $('ask').click(function() {
                    var questionTitle = $('#question-title').val();
                    var questionText = $('#question').val();
                    controller.addQuestion('#nextQuestion', questionTitle, questionText);
                })
            });
    }

    return {
        render: function(controller, selector) {
            return render(controller, selector);
        }
    }
}());