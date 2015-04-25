var app = app || {};

app.validator = (function() {
    function Validator() {
        this._rules = null;
        this._data = null;
        this._errors = {};
    }

    var validateRule = function(ruleKey, ruleValue, ruleData) {

        console.log(ruleKey + ': ' + ruleValue + ' => ' + ruleData);

        switch(ruleKey) {
            case 'required':
                if (ruleValue === true && ruleData) {
                    return true;
                }

                break;
            case 'minlength':
                if (ruleData.toString().length >= ruleValue) {
                    return true;
                }

                break;
            case 'maxlength':
                if (ruleData.toString().length <= ruleValue) {
                    return true;
                }

                break;
            default:
                throw new Error({ 'message': 'Unknown validation rule!'})
        }

        return false;
    }

    // sets validation rules in JSON format
    Validator.prototype.setRules = function(jsonRules) {
        this._rules = jsonRules;

        return this;
    };

    // sets validation data in JSON format
    Validator.prototype.setData = function(jsonData) {
        this._data = jsonData;

        return this;
    };

    // validates all set rules
    Validator.prototype.validate = function() {
        var _this = this;

        $.each(this._rules, function(rulesJSONKey, rulesJSON) {
            $.each(rulesJSON, function(ruleKey, ruleValue) {
                var ruleData = _this._data[rulesJSONKey];

                var ruleValidationResult = validateRule(ruleKey, ruleValue, ruleData);
                if (!ruleValidationResult) {
                    // TODO: set error message as value of error key
                    //this._errors[ruleKey] = true
                }
            });
        });

        return this;
    };

    // checks if validation passed or not
    Validator.prototype.isValid = function() {
        // TODO

        return this;
    };

    // sets error messages for the validation rules
    Validator.prototype.setErrorMessages = function(jsonMessages) {
        // TODO

        return this;
    };

    // returns all error messages
    Validator.prototype.getErrorMessages = function() {
        // TODO

        return this;
    };

    return {
        load: function () {
            return new Validator();
        }
    }
}());