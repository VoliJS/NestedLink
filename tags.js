/**
 * Linked React components for building forms implementing React 0.14 valueLink semantic.
 *
 * WTFPL License, (c) 2016 Vlad Balin, Volicon.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var setValue = function setValue(x, e) {
    return e.target.value;
};
var setBoolValue = function setBoolValue(x, e) {
    return Boolean(e.target.checked);
};

/**
 * Wrapper for standard <input/> to be compliant with React 0.14 valueLink semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *      <input type="checkbox" checkedLink={ linkToBool } />
 *      <input type="radio"    valueLink={ linkToSelectedValue } value="option1value" />
 *      <input type="text"     valueLink={ linkToString } />
 */

function validationClasses(props, value, error) {
    var classNames = props.className ? [props.className] : [];

    if (error) {
        classNames.push(props.invalidClass || 'invalid');

        if (value === '') {
            classNames.push(props.requiredClass || 'required');
        }
    }

    return classNames.join(' ');
}

var Input = function Input(props) {
    var valueLink = props.valueLink;
    var checkedLink = props.checkedLink;
    var rest = _objectWithoutProperties(props, ['valueLink', 'checkedLink']);
    var type = props.type;
    var link = valueLink || checkedLink;

    switch (type) {
        case 'checkbox':
            return _react2['default'].createElement('input', _extends({}, rest, {
                checked: link.value,
                onChange: link.action(setBoolValue) }));

        case 'radio':
            return _react2['default'].createElement('input', _extends({}, rest, {
                checked: link.value === props.value,
                onChange: function (e) {
                    e.target.checked && link.set(props.value);
                } }));

        default:
            return _react2['default'].createElement('input', _extends({}, rest, {
                className: validationClasses(rest, valueLink.value, valueLink.error),
                value: valueLink.value,
                onChange: valueLink.action(setValue) }));
    }
};

exports.Input = Input;
var isRequired = function isRequired(x) {
    return x != null && x !== '';
};
exports.isRequired = isRequired;
isRequired.error = 'Required';

var emailPattern = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
var isEmail = function isEmail(x) {
    return x.match(emailPattern);
};
exports.isEmail = isEmail;
isEmail.error = 'Should be valid email';

// This number component rejects invalid input and modify link only with valid number values.
// Implementing numeric input rejection might be tricky.
var NumberInput = _react2['default'].createClass({
    displayName: 'NumberInput',

    propTypes: {
        positive: _react.PropTypes.bool,
        integer: _react.PropTypes.bool,
        valueLink: _react.PropTypes.object
    },

    componentWillMount: function componentWillMount() {
        // Initialize component state
        this.setAndConvert(this.props.valueLink.value);
    },

    setValue: function setValue(x) {
        // We're not using native state in order to avoid race condition.
        this.value = String(x);
        this.error = this.value === '' || isNaN(Number(x));
        this.forceUpdate();
    },

    setAndConvert: function setAndConvert(x) {
        var value = Number(x);

        if (this.props.positive) {
            value = Math.abs(x);
        }

        if (this.props.integer) {
            value = Math.round(value);
        }

        this.setValue(value);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var next = nextProps.valueLink;

        if (Number(next.value) !== Number(this.value)) {
            this.setAndConvert(next.value); // keep state being synced
        }
    },

    render: function render() {
        var _props = this.props;
        var valueLink = _props.valueLink;
        var props = _objectWithoutProperties(_props, ['valueLink']);
        var error = valueLink.error || this.error;

        return _react2['default'].createElement('input', _extends({}, props, {
            type: 'text',
            className: validationClasses(props, this.value, error),
            value: this.value,
            onKeyPress: this.onKeyPress,
            onChange: this.onChange
        }));
    },

    onKeyPress: function onKeyPress(e) {
        var charCode = e.charCode;
        var _props2 = this.props;
        var integer = _props2.integer;
        var positive = _props2.positive;
        var allowed = (positive ? [] : [45]).concat(integer ? [] : [46]);

        if (e.ctrlKey) return;

        if (charCode && ( // allow control characters
        charCode < 48 || charCode > 57) && // char is number
        allowed.indexOf(charCode) < 0) {
            // allowed char codes
            e.preventDefault();
        }
    },

    onChange: function onChange(e) {
        // Update local state...
        var value = e.target.value;

        this.setValue(value);

        var asNumber = Number(value);

        if (value && !isNaN(asNumber)) {
            this.props.valueLink.update(function (x) {
                // Update link if value is changed
                if (asNumber !== Number(x)) {
                    return asNumber;
                }
            });
        }
    }
});

exports.NumberInput = NumberInput;
/**
 * Wrapper for standard <textarea/> to be compliant with React 0.14 valueLink semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *     <TextArea valueLink={ linkToText } />
 */
var TextArea = function TextArea(_ref) {
    var valueLink = _ref.valueLink;

    var props = _objectWithoutProperties(_ref, ['valueLink']);

    return _react2['default'].createElement('textarea', _extends({}, props, {
        className: validationClasses(props, valueLink.value, valueLink.error),
        value: valueLink.value,
        onChange: valueLink.action(setValue) }));
};

exports.TextArea = TextArea;
/**
 * Wrapper for standard <select/> to be compliant with React 0.14 valueLink semantic.
 * Regular <option/> tags must be used:
 *
 *     <Select valueLink={ linkToSelectedValue }>
 *         <option value="a">A</option>
 *         <option value="b">B</option>
 *     </Select>
 */
var Select = function Select(_ref2) {
    var valueLink = _ref2.valueLink;
    var children = _ref2.children;

    var props = _objectWithoutProperties(_ref2, ['valueLink', 'children']);

    return _react2['default'].createElement(
        'select',
        _extends({}, props, {
            value: valueLink.value,
            onChange: valueLink.action(setValue) }),
        children
    );
};

exports.Select = Select;
/**
 * Simple custom <Radio/> tag implementation. Can be easily styled.
 * Intended to be used with offhand bool link:
 *
 *    <Radio checkedLink={ linkToValue.equals( optionValue ) />
 */

var Radio = function Radio(_ref3) {
    var _ref3$className = _ref3.className;
    var className = _ref3$className === undefined ? 'radio' : _ref3$className;
    var checkedLink = _ref3.checkedLink;
    var children = _ref3.children;
    return _react2['default'].createElement(
        'div',
        { className: className + (checkedLink.value ? ' selected' : ''),
            onClick: checkedLink.action(function () {
                return true;
            })
        },
        children
    );
};

exports.Radio = Radio;
/**
 * Simple custom <Checkbox /> tag implementation.
 * Takes any type of boolean link. Can be easily styled.
 *
 *     <Checkbox checkedLink={ boolLink } />
 */

var Checkbox = function Checkbox(_ref4) {
    var _ref4$className = _ref4.className;
    var className = _ref4$className === undefined ? 'checkbox' : _ref4$className;
    var checkedLink = _ref4.checkedLink;
    var children = _ref4.children;
    return _react2['default'].createElement(
        'div',
        { className: className + (checkedLink.value ? ' selected' : ''),
            onClick: checkedLink.action(function (x) {
                return !x;
            })
        },
        children
    );
};
exports.Checkbox = Checkbox;
