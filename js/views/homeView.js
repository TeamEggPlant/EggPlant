var app = app || {};

app.homeView = (function() {
    function render(controller, selector, data) {
        $.get('templates/home.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
            //TODO - I need to figure out how to get a specific post, not just the first one
            .then(function() {
                $('[class = post]').click(function() {
                    console.log($('[class = post]').attr('about'));
                    var objectId = $('.post').attr('about');

                    controller.loadQuestion('#wrapper', data, objectId);
                });
            })
    }

    return {
        render: function (controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());