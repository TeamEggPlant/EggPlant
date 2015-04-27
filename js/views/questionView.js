var app = app || {};

app.questionView = (function() {
    function render(controller, selector, data) {
        $.get('templates/question-view.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
            .then(function() {
                $('#comment').click(function() {
                    if (typeof sessionStorage['userId'] != undefined) {
                        $('#commentAll').show();
                        $('#comment').click(function() {
                            var questionId = data['objectId'];
                            var answerData = {
                                answerBody: $('#commentBody').val(),
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
                            controller.addComment('#postedCommentBody', answerData);
                        });
                    } else {
                        //If you don't like it like that, you can go for .show()
                        $('#isNotLogged').css('display', 'block');
                    }
                })
        });
    }

    return {
        render: function(controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());