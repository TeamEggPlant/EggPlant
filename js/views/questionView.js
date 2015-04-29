var app = app || {};

app.questionView = (function() {
    function render(controller, selector, data) {
        $.get('templates/question-view.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
        .then(function() {
            $('#add-answer').click(function() {
                var questionId = data['objectId'];
                var answerBody = $('#answer-body').val();

                controller.addComment('#answer-holder', questionId, answerBody);
            });
        });
    }

    return {
        render: function(controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());