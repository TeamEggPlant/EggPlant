var app = app || {};

app.askQuestionView = (function() {
    function render(controller, selector, data) {
        $.get('templates/ask-question.html', function(template) {
            var output = Mustache.render(template, data);

            $(selector).html(output);
        })
            .then(function() {
                $('#ask').click(function() {
                    var title = $('#question-title').val();
                    var text = $('#question').val();
                    var tags = $('#question-tags').val();
                    var categoryId = $('#question-category :selected').val();

                    controller.addQuestion('#wrapper', title, text, tags, categoryId);
                })
            });
    }

    return {
        render: function(controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());