var app = app || {};

app.askQuestionView = (function() {
    function render(controller, selector) {
        $.get('templates/ask-question.html', function(template) {
            var output = Mustache.render(template);

            $(selector).html(output);
        })
            .then(function() {
                $('#ask').click(function() {
                    var questionCategoryId = $('#question-category :selected').val();
                    var questionData = {
                        title: $('#question-title').val(),
                        text: $('#question').val(),
                        categoryId: {
                            '__type': 'Pointer',
                            'className': 'Category',
                            'objectId': questionCategoryId
                        },
                        creator: {
                            '__type': 'Pointer',
                            'className': '_User',
                            'objectId': sessionStorage['userId']
                        }
                    };

                    controller.addQuestion('#wrapper', questionData);
                })
            });
    }

    return {
        render: function(controller, selector) {
            return render(controller, selector);
        }
    }
}());