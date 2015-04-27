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
            case 'equalTo':
                if (ruleValue === ruleData) {
                    return true;
                }

                break;
            case 'email':
                var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (emailRegex.test(ruleData)) {
                    return true;
                }

                break;
            default:
                throw new Error('Unknown validation rule(' + ruleKey + ')!');
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
                    var errorMessage = {
                        'message' : _this._errorMessages[rulesJSONKey][ruleKey]
                    };

                    if (errorMessage.message === undefined) {
                        throw new Error('Validation rule has no error message!');
                    }

                    _this._errors.push(errorMessage);

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

    // returns object containing all error messages
    Validator.prototype.getErrorMessages = function() {
        return {
            'errorMessages' : this._errors
        };
    };

    return {
        load: function () {
            return new Validator();
        }
    }
}());