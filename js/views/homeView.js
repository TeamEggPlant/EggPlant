var app = app || {};

app.homeView = (function() {
    function render(controller, selector, data) {
        $.get('templates/home.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
        .then(function() {
            $('#search').click(function(e) {
                var searchValue = $('#search-value').val();

                // TODO: search functionality
                //controller.search('#wrapper', loginUsername, loginPassword);
                e.preventDefault();
            })
        });
    }

    return {
        render: function (controller, selector, data) {
            return render(controller, selector, data);
        }
    }
}());