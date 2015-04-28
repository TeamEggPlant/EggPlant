var app = app || {};

app.menuView = (function() {
    function render(selector, menuType, activePage) {
        var lastMenuType = $(selector).attr('data-type');

        if (lastMenuType !== menuType) {
            $.get('templates/' + menuType + '-menu.html', function(template) {
                var output = Mustache.render(template);
                $(selector).html(output);
                $(selector).attr('data-type', menuType);
            });
        }

        $('.nav').find('li').each(function () {
            $(this).removeClass('active');
        });
        $('li#' + activePage).addClass('active');
    }

    return {
        render: function(selector, type, activePage) {
            return render(selector, type, activePage);
        }
    }
}());