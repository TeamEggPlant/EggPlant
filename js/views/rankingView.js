var app = app || {};

app.rankingView = (function() {
    function render(controller, selector, data) {
        $.get('templates/ranking.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        render: function (controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());