var app = app || {};

app.homeView = (function() {
    function render(controller, selector, data) {
        $.get('templates/home.html', function(template) {
            var output = Mustache.render(template);
            $(selector).html(output);
        })
    }

    return {
        render: function (controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());