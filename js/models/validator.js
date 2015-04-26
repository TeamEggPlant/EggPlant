var app = app || {};

app.validator = (function() {
    function Validator() {
        this._rules = null;
        this._data = null;
        this._errorMessages = null;
        this._errors = [];
    }

    var validateRule = function validateRule(ruleKey, ruleValue, ruleData) {
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
            case 'regex':
                if (ruleValue.test(ruleData)) {
                    return true;
                }

                break;
            default:
                throw new Error('Unknown validation rule!');
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
                    var errorMessage = _this._errorMessages[rulesJSONKey][ruleKey];

                    if (errorMessage === undefined) {
                        throw new Error('Validation rule has no error message!');
                    }

                    _this._errors.push(_this._errorMessages[rulesJSONKey][ruleKey]);

                    return false;
                }
            });
        });

        return this;
    };

    // checks if validation passed or not
    Validator.prototype.isValid = function() {
        if (this._errors.length === 0) {
            return true;
        }

        return false;
    };

    // sets error messages for the validation rules
    Validator.prototype.setErrorMessages = function(jsonErrorMessages) {
        this._errorMessages = jsonErrorMessages;

        return this;
    };

    // returns array containing all error messages
    Validator.prototype.getErrorMessages = function() {
        return this._errors;

        return this;
    };

    return {
        load: function () {
            return new Validator();
        }
    }
}());