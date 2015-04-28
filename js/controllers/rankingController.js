var app = app || {};

app.rankingController = (function() {
    function Controller(model) {
        this._model = model;
    }

    Controller.prototype.loadRankingPage = function(selector) {
        var _this = this;

        Q.all([
            this._model.getAllQuestions(),
            this._model.getAllAnswers()
        ]).then(function(data) {
            var questionsData = data[0].results;
            var answersData = data[1].results;
            var usersRanking = _this._model.extractUsersRanking(questionsData, answersData);

            app.rankingView.render(_this, selector, usersRanking);
        }, function (error) {
            $.notify(error.responseJSON.error, {position: 'top center'});
        });
    };

    return {
        load: function(model) {
            return new Controller(model);
        }
    }
}());