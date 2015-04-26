var app = app || {};

app.homeView = (function() {
    function render(controller, selector, data) {
        $.get('templates/home.html', function(template, data) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }

    return {
        render: function (controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());