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
                var answerData = {
                    answerBody: $('#answer-body').val(),
                    questionId: {
                        '__type': 'Pointer',
                        'className': 'Question',
                        'objectId': questionId
                    },
                    creator: {
                        '__type': 'Pointer',
                        'className': '_User',
                        'objectId': sessionStorage['userId']
                    }
                };

                controller.addComment('#answer-holder', answerData);
            });
        });
    }

    return {
        render: function(controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());