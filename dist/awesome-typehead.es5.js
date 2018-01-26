import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, NgModule, Output, ViewContainerRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { Subject as Subject$1 } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
var AwesomeOptionsComponent = (function () {
    /**
     * @param {?} optionsElement
     */
    function AwesomeOptionsComponent(optionsElement) {
        this.optionsElement = optionsElement;
        this.debug = false;
        this.helperButton = 'test';
        this.onOptionSelected = new EventEmitter();
        this.onMouseEnter = new EventEmitter();
        this.onHelperButtonClick = new EventEmitter();
    }
    Object.defineProperty(AwesomeOptionsComponent.prototype, "options", {
        /**
         * @return {?}
         */
        get: function () {
            return this._options;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._options = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwesomeOptionsComponent.prototype, "style", {
        /**
         * @param {?} style
         * @return {?}
         */
        set: function (style) {
            this.optionsElement.nativeElement.setAttribute('style', style);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    AwesomeOptionsComponent.prototype.ngOnInit = function () {
    };
    /**
     * @param {?} option
     * @return {?}
     */
    AwesomeOptionsComponent.prototype.selectOption = function (option) {
        this.onOptionSelected.emit(option);
    };
    /**
     * @param {?} option
     * @return {?}
     */
    AwesomeOptionsComponent.prototype.isOptionSelected = function (option) {
        if (!this.selectedOption) {
            return false;
        }
        if (typeof option === 'object') {
            return option.text === this.selectedOption.text;
        }
        else {
            return option === this.selectedOption;
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeOptionsComponent.prototype.onMouseEntered = function ($event) {
        this.onMouseEnter.emit($event);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeOptionsComponent.prototype.onHelperButtonClickHandler = function ($event) {
        this.onHelperButtonClick.emit($event);
    };
    return AwesomeOptionsComponent;
}());
AwesomeOptionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'a-options',
                template: "\n      <div class=\"a-options\"\n          (mouseenter)=\"onMouseEntered($event)\" >\n          <ul class=\"dropdown-menu show\">\n              <li class=\"hidden\">\n                  <a href=\"javascript:void(0);\" class=\"dropdown-item\"\n                      *ngIf=\"helperButton\"\n                      (click)=\"onHelperButtonClickHandler($event)\">{{helperButton}}</a>\n              </li>\n              <li *ngFor=\"let option of options; let index=index\">\n                  <a href=\"javascript:void(0);\" class=\"dropdown-item\" (click)=\"selectOption(option)\"\n                      [ngClass]=\"{'active': isOptionSelected(option), 'hover': index === activeFocusPosition && !isOptionSelected(option)}\">\n                      {{option.text}}\n                  </a>\n              </li>\n              <li *ngIf=\"!options || options.length === 0\">\n                  <div class=\"text-center\">No matches</div>\n              </li>\n          </ul>\n      </div>\n    ",
                styles: ["\n      .a-options > ul {\n        width: 100%; }\n\n      .a-options > ul > li > a {\n        padding-top: 0.5rem;\n        padding-bottom: 0.5rem; }\n        .a-options > ul > li > a.hover {\n          background-color: rgba(162, 162, 162, 0.1);\n          color: inherit; }\n    "]
            },] },
];
/**
 * @nocollapse
 */
AwesomeOptionsComponent.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
AwesomeOptionsComponent.propDecorators = {
    'options': [{ type: Input },],
    'selectedOption': [{ type: Input },],
    'mainElement': [{ type: Input },],
    'debug': [{ type: Input },],
    'style': [{ type: Input },],
    'activeFocusPosition': [{ type: Input },],
    'helperButton': [{ type: Input },],
    'onOptionSelected': [{ type: Output },],
    'onMouseEnter': [{ type: Output },],
    'onHelperButtonClick': [{ type: Output },],
};
var AwesomeHelper = (function () {
    function AwesomeHelper() {
    }
    /**
     * @param {?} options
     * @param {?} textField
     * @param {?} idField
     * @return {?}
     */
    AwesomeHelper.toAwesomeOptions = function (options, textField, idField) {
        if (!options) {
            return null;
        }
        var /** @type {?} */ awesomeOptions = [];
        options.forEach(function (option) {
            awesomeOptions.push(new AwesomeOption(textField, idField, option));
        });
        return awesomeOptions;
    };
    /**
     * @param {?} awesomeOptions
     * @return {?}
     */
    AwesomeHelper.fromAwesomeOptions = function (awesomeOptions) {
        if (!awesomeOptions) {
            return null;
        }
        var /** @type {?} */ options = [];
        awesomeOptions.forEach(function (option) {
            options.push(option.model);
        });
        return options;
    };
    /**
     * @param {?} element
     * @param {?} query
     * @return {?}
     */
    AwesomeHelper.getStylesPosition = function (element, query) {
        var /** @type {?} */ clientRect = element
            .querySelector(query)
            .getBoundingClientRect();
        var /** @type {?} */ width = clientRect.width;
        var /** @type {?} */ height = clientRect.height;
        var /** @type {?} */ leftOffset = clientRect.left;
        var /** @type {?} */ topOffset = clientRect.top + height + window.pageYOffset;
        return "position: absolute;\n                width: " + width + "px;\n                left: " + leftOffset + "px;\n                top: " + topOffset + "px;\n                z-index: 100000;";
    };
    /**
     * @param {?} text
     * @return {?}
     */
    AwesomeHelper.stringToLowerSafely = function (text) {
        if (!text) {
            return text;
        }
        else {
            return text.toLowerCase();
        }
    };
    return AwesomeHelper;
}());
var AwesomeOption = (function () {
    /**
     * @param {?=} textField
     * @param {?=} idField
     * @param {?=} model
     * @param {?=} simpleText
     */
    function AwesomeOption(textField, idField, model, simpleText) {
        this.textField = textField;
        this.idField = idField;
        this.model = model;
        this.simpleText = simpleText;
    }
    Object.defineProperty(AwesomeOption.prototype, "text", {
        /**
         * @return {?}
         */
        get: function () {
            if (this.model && this.textField) {
                return this.model[this.textField];
            }
            else if (this.simpleText) {
                return this.simpleText;
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwesomeOption.prototype, "id", {
        /**
         * @return {?}
         */
        get: function () {
            if (this.model && this.idField) {
                return this.model[this.idField];
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} newValue
     * @return {?}
     */
    AwesomeOption.prototype.compare = function (newValue) {
        if (!newValue) {
            return false;
        }
        var /** @type {?} */ curText = AwesomeHelper.stringToLowerSafely(this.text);
        var /** @type {?} */ curId = this.id;
        if (newValue instanceof AwesomeOption) {
            var /** @type {?} */ newText = AwesomeHelper.stringToLowerSafely(newValue.text);
            var /** @type {?} */ newId = newValue.id;
            return curText === newText && curId === newId;
        }
        else {
            var /** @type {?} */ newText = AwesomeHelper.stringToLowerSafely(newValue[this.textField]);
            var /** @type {?} */ newId = newValue[this.idField];
            return curText === newText && this.id === newId;
        }
    };
    return AwesomeOption;
}());
var noop = function () { };
var AwesomeTypeheadComponent = (function () {
    /**
     * @param {?} container
     * @param {?} optionsElement
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     */
    function AwesomeTypeheadComponent(container, optionsElement, componentFactoryResolver, viewContainerRef) {
        this.container = container;
        this.optionsElement = optionsElement;
        this.componentFactoryResolver = componentFactoryResolver;
        this.viewContainerRef = viewContainerRef;
        this.formControl = new FormControl();
        this.idField = 'id';
        this.textField = 'text';
        this.id = Math.random();
        this.debug = false;
        this.filterOnBackend = false;
        this.filterDelayMs = 150;
        this.helperButton = 'test';
        this.onHelperButtonClick = new EventEmitter();
        this.onOptionSelected = new EventEmitter();
        this.optionsRaw = [];
        this.optionsUnFiltered = [];
        this.optionsFiltered = [];
        this._optionsOpened = false;
        this.optionsFilterTerms = new Subject$1();
        this.isDisabled = false;
        this.onChange = noop;
        this.onTouched = noop;
        this.onWindowScrollOrResizeDelegate = this.onWindowScrollOrResize.bind(this);
        this.onBodyClickDelegate = this.onBodyClick.bind(this);
    }
    Object.defineProperty(AwesomeTypeheadComponent.prototype, "options", {
        /**
         * @param {?} options
         * @return {?}
         */
        set: function (options) {
            this.optionsRaw = options;
            this.setOptions(options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwesomeTypeheadComponent.prototype, "selectedOption", {
        /**
         * @return {?}
         */
        get: function () {
            return this._selectedOption;
        },
        /**
         * @param {?} option
         * @return {?}
         */
        set: function (option) {
            this.setSelectedOption(option);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwesomeTypeheadComponent.prototype, "optionsOpened", {
        /**
         * @return {?}
         */
        get: function () {
            return this._optionsOpened;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._optionsOpened = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.filterOnBackend) {
            // TODO develop filtering on backend
            // it should execute the routine for requesting data
            // and show the spinner while this is loading
        }
        else {
            // run the filter search with debounce time configured in the component
            this.optionsFilterObservable = this.optionsFilterTerms
                .debounceTime(this.filterDelayMs)
                .distinctUntilChanged()
                .switchMap(function (term) {
                return Observable$1.of(_this.filterOptions(term, _this.optionsUnFiltered));
            });
            // update filtered options
            this.optionsFilterObservable.subscribe(function (data) {
                if (_this.debug) {
                    console.log('filtered', data, _this.optionsFiltered, _this.optionsUnFiltered);
                }
                _this.optionsFiltered = data;
                _this.optionsComponentRef.instance.options = data;
            });
        }
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.ngOnDestroy = function () {
        this.removeOptionsComFromBody();
    };
    /**
     * @param {?} val
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.writeValue = function (val) {
        if (this.isValueUpdateRequired(val)) {
            this.setSelectedOption(val, false);
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.setDisabledState = function (isDisabled) {
        this.isDisabled = isDisabled;
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.toggleOptions = function () {
        if (this._optionsOpened === true) {
            this.closeOptions();
        }
        else {
            this.optionsFilterTerms.next(this.typeHeadValue);
            this.openOptions();
            this.focusIntoInputControl();
        }
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.openOptions = function () {
        this._optionsOpened = true;
        this.appendOptionsCompToBody();
        this.bindEvents();
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.closeOptions = function () {
        this.removeOptionsComFromBody();
        this._optionsOpened = false;
        this.activeFocusPosition = undefined;
        this.unBindEvents();
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.focusIntoInputControl = function () {
        var _this = this;
        setTimeout(function () {
            _this.getInputControl().select();
        }, 1);
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.selectInputControlText = function () {
        var _this = this;
        setTimeout(function () {
            _this.getInputControl().select();
        }, 1);
    };
    /**
     * @param {?} option
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.optionWasSelected = function (option) {
        if (this.debug) {
            console.log('onOptionSelected', option);
        }
        this.selectedOption = option;
        this.closeOptions();
        if (option) {
            this.selectInputControlText();
            this.onOptionSelected.emit(option.model);
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.onInputBlur = function ($event) {
        var _this = this;
        if (!this.selectedOption || (this.selectedOption.text !== this.typeHeadValue)) {
            this.matchInputWithOption();
        }
        setTimeout(function () {
            if (_this.debug) {
                console.log('onInputBlur');
            }
            // close the options if active focus is not inside the element
            if ((document.activeElement !== _this.getInputGroupButton()) && (document.activeElement !== _this.getInputControl())) {
                _this.closeOptions();
            }
            _this.onTouched();
        }, 250);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.onInputKeyPressed = function ($event) {
        switch ($event.keyCode) {
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            case 38: // up arrow
            case 40:// down arrow
                $event.preventDefault();
                // open options dropdown if it was closed
                if (!this.optionsOpened) {
                    this.openOptions();
                }
                // move the active option line
                if ($event.keyCode === 38) {
                    this.moveActiveFocus(-1);
                }
                else if ($event.keyCode === 40) {
                    this.moveActiveFocus(+1);
                }
                this.optionsComponentRef.instance.activeFocusPosition = this.activeFocusPosition;
                break;
            case 27:// escape
                $event.preventDefault();
                // close options dropdown if it was open
                if (this.optionsOpened) {
                    this.closeOptions();
                }
                // revert the text back to the previous value
                if (this.selectedOption) {
                    if (this.selectedOption.text !== this.typeHeadValue) {
                        this.typeHeadValue = this.selectedOption.text;
                    }
                }
                else {
                    // reset the typehead text if there was no option selected before
                    this.typeHeadValue = '';
                }
                // focus into typehead
                this.focusIntoInputControl();
                break;
            case 13:// enter
                $event.preventDefault();
                if (this.activeFocusPosition !== undefined) {
                    var /** @type {?} */ selectedOption = this.optionsFiltered[this.activeFocusPosition];
                    this.setSelectedOption(selectedOption);
                    this.activeFocusPosition = undefined;
                    this.closeOptions();
                    this.focusIntoInputControl();
                }
                else {
                    if (this.typeHeadValue === '') {
                        this.setSelectedOption(null);
                        this.closeOptions();
                    }
                    else {
                        this.matchInputWithOption();
                        this.closeOptions();
                        this.focusIntoInputControl();
                    }
                }
                break;
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.onOptionsMouseEntered = function ($event) {
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.onInputGroupMouseEntered = function ($event) {
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.onWindowScrollOrResize = function () {
        this.updateOptionsScreenLocation();
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.onBodyClick = function ($event) {
        // find if the click has occured inside of the container or options elements
        var /** @type {?} */ matchingElement = $event.path.indexOf(this.container.nativeElement);
        if (matchingElement === -1) {
            matchingElement = $event.path.indexOf(this.optionsComponentRef.instance.optionsElement.nativeElement);
        }
        // if the click was outside of either component elements ignore and prevent the event
        // otherwise close the options
        if (matchingElement !== -1) {
            $event.preventDefault();
            return;
        }
        else {
            this.closeOptions();
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.onInputChange = function ($event) {
        if (this.debug) {
            console.log('onInputChange', $event);
        }
        // open options dropdown if it was closed
        if (!this.optionsOpened) {
            this.openOptions();
        }
        // insert term into routine call
        this.optionsFilterTerms.next($event);
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.appendOptionsCompToBody = function () {
        var _this = this;
        var /** @type {?} */ factory = this.componentFactoryResolver.resolveComponentFactory(AwesomeOptionsComponent);
        this.optionsComponentRef = this.viewContainerRef.createComponent(factory);
        this.optionsComponentRef.changeDetectorRef.detectChanges();
        this.optionsComponentRef.instance.options = this.optionsFiltered;
        this.optionsComponentRef.instance.debug = this.debug;
        this.optionsComponentRef.instance.selectedOption = this.selectedOption;
        this.optionsComponentRef.instance.mainElement = this.container;
        this.optionsComponentRef.instance.helperButton = this.helperButton;
        this.optionsComponentRef.instance.onOptionSelected.subscribe(function (data) { return _this.optionWasSelected(data); });
        this.optionsComponentRef.instance.onHelperButtonClick.subscribe(function (data) { return _this.onHelperButtonClick.emit(data); });
        document.querySelector('body')
            .appendChild(this.optionsComponentRef.instance.optionsElement.nativeElement);
        this.updateOptionsScreenLocation();
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.removeOptionsComFromBody = function () {
        if (this.optionsComponentRef) {
            this.optionsComponentRef.destroy();
        }
    };
    /**
     * @param {?} options
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.setOptions = function (options) {
        if (this.debug) {
            console.log('setOptions', options);
        }
        if (!options) {
            this.optionsUnFiltered = [];
        }
        else {
            var /** @type {?} */ awesomeOptions = AwesomeHelper
                .toAwesomeOptions(options, this.textField, this.idField);
            this.optionsUnFiltered = awesomeOptions;
            this.optionsFiltered = awesomeOptions;
        }
    };
    /**
     * @param {?} option
     * @param {?=} updateFormControl
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.setSelectedOption = function (option, updateFormControl) {
        if (updateFormControl === void 0) { updateFormControl = true; }
        if (this.debug) {
            console.log('setSelectedOption', option, updateFormControl);
        }
        if (!option) {
            this.updateSelectedOptionValue(null, null, updateFormControl);
            return;
        }
        // set either model or simple text to a formControl instance
        if (option instanceof AwesomeOption) {
            // update value only if it differes
            // this prevents unnecessary events being triggered
            if (this.isValueUpdateRequired(option)) {
                this.updateSelectedOptionValue(option, option.text, updateFormControl);
            }
        }
        else {
            if (typeof option === 'object') {
                var /** @type {?} */ awesomeOption = new AwesomeOption(this.textField, this.idField, option);
                this.updateSelectedOptionValue(awesomeOption, awesomeOption.text, updateFormControl);
            }
            else {
                var /** @type {?} */ awesomeOption = new AwesomeOption(null, null, null, option);
                this.updateSelectedOptionValue(awesomeOption.text, awesomeOption.text, updateFormControl);
            }
        }
    };
    /**
     * @param {?} objValue
     * @param {?} textValue
     * @param {?=} updateFormControl
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.updateSelectedOptionValue = function (objValue, textValue, updateFormControl) {
        if (updateFormControl === void 0) { updateFormControl = true; }
        if (this.debug) {
            console.log('updateSelectedOptionValue', objValue, textValue, updateFormControl);
        }
        this._selectedOption = objValue;
        this.typeHeadValue = textValue;
        if (updateFormControl) {
            if (objValue instanceof AwesomeOption) {
                this.formControl.setValue(objValue.model);
                this.onChange(objValue.model);
            }
            else {
                this.formControl.setValue(objValue);
                this.onChange(objValue);
            }
        }
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.matchInputWithOption = function () {
        var _this = this;
        if (!this.typeHeadValue) {
            this.selectedOption = null;
            return;
        }
        if (this.optionsFiltered && this.optionsFiltered.length === 1) {
            this.selectedOption = this.optionsFiltered[0];
            this.typeHeadValue = this.optionsFiltered[0].text;
            this.onOptionSelected.emit(this.selectedOption.model);
        }
        else {
            // if the user has typed in different casing it will automatically match with an option
            var /** @type {?} */ foundOption = this.optionsUnFiltered
                .find(function (a) { return a.text.toLocaleLowerCase() === _this.typeHeadValue.toLocaleLowerCase(); });
            if (foundOption) {
                this.selectedOption = foundOption;
                this.typeHeadValue = foundOption.text;
                this.onOptionSelected.emit(foundOption.model);
            }
            else {
                // reset the value if the user hasn't selected anything
                this.typeHeadValue = null;
                this.selectedOption = null;
            }
        }
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.updateOptionsScreenLocation = function () {
        var /** @type {?} */ clientRect = this.container.nativeElement
            .querySelector('.a-typehead')
            .getBoundingClientRect();
        var /** @type {?} */ width = clientRect.width;
        var /** @type {?} */ height = clientRect.height;
        var /** @type {?} */ leftOffset = clientRect.left;
        var /** @type {?} */ topOffset = clientRect.top + height + window.pageYOffset;
        this.optionsComponentRef.instance.style =
            "position: absolute;\n            width: " + width + "px;\n            left: " + leftOffset + "px;\n            top: " + topOffset + "px;\n            z-index: 10000";
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.getInputControl = function () {
        return this.container.nativeElement.querySelector('.form-control');
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.getInputGroupButton = function () {
        return this.container.nativeElement.querySelector('.input-group-addon');
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.bindEvents = function () {
        window.addEventListener('scroll', this.onWindowScrollOrResizeDelegate, true);
        window.addEventListener('resize', this.onWindowScrollOrResizeDelegate, true);
        document.addEventListener('click', this.onBodyClickDelegate, true);
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.unBindEvents = function () {
        window.removeEventListener('scroll', this.onWindowScrollOrResizeDelegate, true);
        window.removeEventListener('resize', this.onWindowScrollOrResizeDelegate, true);
        document.removeEventListener('click', this.onBodyClickDelegate, true);
    };
    /**
     * @param {?} option
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.isValueUpdateRequired = function (option) {
        return ((this._selectedOption && !this._selectedOption.compare(option))
            || (!this._selectedOption && option));
    };
    /**
     * @param {?} text
     * @param {?} options
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.filterOptions = function (text, options) {
        if (this.debug) {
            console.log('filterOptions', options);
        }
        if (!text || text === '') {
            // if there is no text supplied return unfiltered options
            return options;
        }
        else if (this.selectedOption && ((this.selectedOption)).text.toLowerCase() === text.toLowerCase()) {
            // if selected option text is the same as searched text return unfiltered options
            return options;
        }
        else {
            // in all other conditions return filtered options
            return options.filter(function (option) {
                // filter by text contained in the option text
                return option.text.toLowerCase().includes(text.toLowerCase());
            });
        }
    };
    /**
     * @param {?} position
     * @return {?}
     */
    AwesomeTypeheadComponent.prototype.moveActiveFocus = function (position) {
        if (this.debug) {
            console.log('moveActiveFocus position', position);
        }
        var /** @type {?} */ newPos = this.activeFocusPosition;
        if (newPos === undefined) {
            newPos = 0;
        }
        else {
            newPos += position;
        }
        if (this.optionsFiltered.length < newPos + 1) {
            newPos = 0;
        }
        else if (newPos < 0) {
            newPos = this.optionsFiltered.length - 1;
        }
        this.activeFocusPosition = newPos;
        if (this.debug) {
            console.log('moveActiveFocus newPos', newPos);
        }
    };
    return AwesomeTypeheadComponent;
}());
AwesomeTypeheadComponent.decorators = [
    { type: Component, args: [{
                selector: 'a-typehead',
                providers: [{
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(function () { return AwesomeTypeheadComponent; }),
                        multi: true
                    }],
                template: "\n      <div class=\"input-group a-typehead\"\n          (mouseenter)=\"onInputGroupMouseEntered($event)\">\n          <input type=\"text\" class=\"form-control\" autocomplete=\"off\"\n              (blur)=\"onInputBlur($event)\"\n              (keydown)=\"onInputKeyPressed($event)\"\n              (ngModelChange)=\"onInputChange($event)\"\n              [id]=\"id\"\n              [(ngModel)]=\"typeHeadValue\"\n              [disabled]=\"isDisabled\" />\n          <input type=\"hidden\" [formControl]=\"formControl\" />\n          <span class=\"input-group-btn\">\n              <button type=\"button\" class=\"btn btn-secondary\" (click)=\"toggleOptions()\" [disabled]=\"isDisabled\">\n                  <i class=\"dropdown-toggle\"></i>\n              </button>\n          </span>\n      </div>\n      <div *ngIf=\"debug\">debug: {{_selectedOption|json}}</div>\n    ",
                styles: ["\n\n    "]
            },] },
];
/**
 * @nocollapse
 */
AwesomeTypeheadComponent.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: ElementRef, },
    { type: ComponentFactoryResolver, },
    { type: ViewContainerRef, },
]; };
AwesomeTypeheadComponent.propDecorators = {
    'formControl': [{ type: Input },],
    'idField': [{ type: Input },],
    'textField': [{ type: Input },],
    'id': [{ type: Input },],
    'debug': [{ type: Input },],
    'options': [{ type: Input },],
    'selectedOption': [{ type: Input },],
    'optionsOpened': [{ type: Input },],
    'filterOnBackend': [{ type: Input },],
    'filterDelayMs': [{ type: Input },],
    'helperButton': [{ type: Input },],
    'onHelperButtonClick': [{ type: Output },],
    'onOptionSelected': [{ type: Output },],
};
var noop$1 = function () { };
var AwesomeTypeheadMultipleComponent = (function () {
    /**
     * @param {?} container
     * @param {?} optionsElement
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     */
    function AwesomeTypeheadMultipleComponent(container, optionsElement, componentFactoryResolver, viewContainerRef) {
        this.container = container;
        this.optionsElement = optionsElement;
        this.componentFactoryResolver = componentFactoryResolver;
        this.viewContainerRef = viewContainerRef;
        this.formControl = new FormControl();
        this.idField = 'id';
        this.textField = 'text';
        this.placeholder = '';
        this.id = Math.random();
        this.debug = false;
        this.filterDelayMs = 50;
        this.onHelperButtonClick = new EventEmitter();
        this.onOptionSelected = new EventEmitter();
        this.isDisabled = false;
        this.optionsDropOpen = false;
        this.inputFocusedIn = false;
        this.optionsRaw = [];
        this.optionsUnFiltered = [];
        this.optionsFiltered = [];
        this.selectedOptionsValue = [];
        this.onWindowScrollOrResizeDelegate = this.onWindowScrollOrResize.bind(this);
        this.onBodyClickDelegate = this.onBodyClick.bind(this);
        this.optionsFilterTerms = new Subject$1();
        this.onChange = noop$1;
        this.onTouched = noop$1;
    }
    Object.defineProperty(AwesomeTypeheadMultipleComponent.prototype, "options", {
        /**
         * @param {?} options
         * @return {?}
         */
        set: function (options) {
            this.optionsRaw = options;
            this.setOptions(options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwesomeTypeheadMultipleComponent.prototype, "selectedOptions", {
        /**
         * @param {?} options
         * @return {?}
         */
        set: function (options) {
            this.setSelectedOptions(options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwesomeTypeheadMultipleComponent.prototype, "optionsOpened", {
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this.optionsDropOpen = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} val
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.writeValue = function (val) {
        if (this.isValueUpdateRequired(val)) {
            this.setSelectedOptions(val, false);
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.setDisabledState = function (isDisabled) {
        this.isDisabled = isDisabled;
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.ngOnInit = function () {
        var _this = this;
        {
            // run the filter search with debounce time configured in the component
            this.optionsFilterObservable = this.optionsFilterTerms
                .debounceTime(this.filterDelayMs)
                .switchMap(function (term) {
                return Observable$1.of(_this.filterOptions(term, _this.optionsUnFiltered));
            });
            // update filtered options
            this.optionsFilterObservable.subscribe(function (data) {
                if (_this.debug) {
                    console.log('filtered', data, _this.optionsFiltered, _this.optionsUnFiltered);
                }
                _this.optionsFiltered = data;
                _this.optionsComponentRef.instance.options = data;
            });
        }
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.ngOnDestroy = function () {
        this.removeOptionsComFromBody();
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.onInputBlur = function ($event) {
        var _this = this;
        this.toggleClassOnFocus();
        if (this.debug) {
            console.log('onInputBlur');
        }
        setTimeout(function () {
            // close the options if active focus is not inside the element
            if ((document.activeElement !== _this.getInputGroupButton()) &&
                (document.activeElement !== _this.getInputControl())) {
                _this.closeOptions();
            }
            _this.onTouched();
        }, 250);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.onInputFocus = function ($event) {
        this.toggleClassOnFocus();
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.onInputKeyPressed = function ($event) {
        switch ($event.keyCode) {
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            case 38: // up arrow
            case 40:// down arrow
                $event.preventDefault();
                // open options dropdown if it was closed
                if (!this.optionsDropOpen) {
                    this.openOptions();
                }
                // move the active option line
                if ($event.keyCode === 38) {
                    this.moveActiveFocus(-1);
                }
                else if ($event.keyCode === 40) {
                    this.moveActiveFocus(+1);
                }
                this.optionsComponentRef.instance.activeFocusPosition = this.activeFocusPosition;
                break;
            case 27:// escape
                $event.preventDefault();
                // close options dropdown if it was open
                if (this.optionsDropOpen) {
                    this.closeOptions();
                }
                // reset the typehead text
                this.typeHeadValue = '';
                // focus into typehead
                this.focusIntoInputControl();
                break;
            case 13:// enter
                $event.preventDefault();
                if (this.activeFocusPosition !== undefined) {
                    var /** @type {?} */ selectedOption = this.optionsFiltered[this.activeFocusPosition];
                    this.optionWasSelected(selectedOption);
                    this.activeFocusPosition = undefined;
                    this.closeOptions();
                    this.focusIntoInputControl();
                }
                else {
                    this.matchInputWithOption();
                }
                break;
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.onInputChange = function ($event) {
        if (this.debug) {
            console.log('onInputChange', $event);
        }
        // open options dropdown if it was closed
        if (!this.optionsDropOpen) {
            this.openOptions();
        }
        // insert term into routine call
        this.optionsFilterTerms.next($event);
    };
    /**
     * @param {?} option
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.optionWasSelected = function (option) {
        if (this.debug) {
            console.log('optionWasSelected', option);
        }
        if (!this.selectedOptionsValue) {
            this.selectedOptionsValue = [];
        }
        this.selectedOptionsValue.push(option);
        this.setSelectedOptions(this.selectedOptionsValue);
        this.closeOptions();
        if (option) {
            this.selectInputControlText();
            this.onOptionSelected.emit(this.selectedOptionsValue.map(function (opt) {
                return opt.model;
            }));
        }
    };
    /**
     * @param {?} option
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.onOptionRemove = function (option) {
        if (this.debug) {
            console.log('onOptionRemove', option);
        }
        this.selectedOptionsValue = this.selectedOptionsValue.filter(function (filteredOption) {
            return filteredOption.compare(option) === false;
        });
        this.setSelectedOptions(this.selectedOptionsValue);
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.onWindowScrollOrResize = function () {
        this.updateOptionsScreenLocation();
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.onBodyClick = function ($event) {
        // find if the click has occured inside of the container or options elements
        var /** @type {?} */ matchingElement = $event.path.indexOf(this.container.nativeElement);
        if (matchingElement === -1) {
            matchingElement = $event.path.indexOf(this.optionsComponentRef.instance.optionsElement.nativeElement);
        }
        // if the click was outside of either component elements ignore and prevent the event
        // otherwise close the options
        if (matchingElement !== -1) {
            $event.preventDefault();
            return;
        }
        else {
            this.closeOptions();
        }
    };
    /**
     * @param {?} options
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.setOptions = function (options) {
        if (this.debug) {
            console.log('setOptions', options);
        }
        if (!options) {
            this.optionsUnFiltered = [];
        }
        else {
            var /** @type {?} */ awesomeOptions = AwesomeHelper
                .toAwesomeOptions(options, this.textField, this.idField);
            this.optionsUnFiltered = awesomeOptions;
            this.optionsFiltered = awesomeOptions;
        }
    };
    /**
     * @param {?} options
     * @param {?=} updateFormControl
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.setSelectedOptions = function (options, updateFormControl) {
        var _this = this;
        if (updateFormControl === void 0) { updateFormControl = true; }
        if (this.debug) {
            console.log('setSelectedOptions', options, updateFormControl);
        }
        if (!options || options.length === 0) {
            this.updateSelectedOptionsValue(null, updateFormControl);
            return;
        }
        var /** @type {?} */ needToConvert = !(options[0] instanceof AwesomeOption);
        var /** @type {?} */ awesomeOptions = needToConvert ? [] : options;
        if (needToConvert) {
            options.forEach(function (option) {
                var /** @type {?} */ aOption;
                if (typeof option === 'object') {
                    aOption = new AwesomeOption(_this.textField, _this.idField, option);
                }
                else {
                    aOption = new AwesomeOption(null, null, null, option);
                }
                awesomeOptions.push(aOption);
            });
        }
        // update value only if it differes
        // this prevents unnecessary events being triggered
        if (this.isValueUpdateRequired(awesomeOptions)) {
            this.updateSelectedOptionsValue(awesomeOptions, updateFormControl);
        }
    };
    /**
     * @param {?} arrayValue
     * @param {?=} updateFormControl
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.updateSelectedOptionsValue = function (arrayValue, updateFormControl) {
        if (updateFormControl === void 0) { updateFormControl = true; }
        if (this.debug) {
            console.log('updateSelectedOptionsValue', arrayValue, updateFormControl);
        }
        this.selectedOptionsValue = arrayValue;
        this.typeHeadValue = '';
        if (updateFormControl) {
            var /** @type {?} */ options = AwesomeHelper.fromAwesomeOptions(arrayValue);
            this.formControl.setValue(options);
            this.onChange(options);
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.toggleOptions = function ($event) {
        if (this.optionsDropOpen === true) {
            this.closeOptions();
        }
        else {
            this.optionsFilterTerms.next(this.typeHeadValue);
            this.openOptions();
            this.focusIntoInputControl();
        }
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.toggleClassOnFocus = function () {
        this.inputFocusedIn = !this.inputFocusedIn;
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.openOptions = function () {
        this.optionsDropOpen = true;
        this.appendOptionsCompToBody();
        this.bindEvents();
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.closeOptions = function () {
        this.removeOptionsComFromBody();
        this.optionsDropOpen = false;
        this.activeFocusPosition = undefined;
        this.unBindEvents();
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.bindEvents = function () {
        window.addEventListener('scroll', this.onWindowScrollOrResizeDelegate, true);
        window.addEventListener('resize', this.onWindowScrollOrResizeDelegate, true);
        document.addEventListener('click', this.onBodyClickDelegate, true);
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.unBindEvents = function () {
        window.removeEventListener('scroll', this.onWindowScrollOrResizeDelegate, true);
        window.removeEventListener('resize', this.onWindowScrollOrResizeDelegate, true);
        document.removeEventListener('click', this.onBodyClickDelegate, true);
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.appendOptionsCompToBody = function () {
        var _this = this;
        var /** @type {?} */ factory = this.componentFactoryResolver.resolveComponentFactory(AwesomeOptionsComponent);
        this.optionsComponentRef = this.viewContainerRef.createComponent(factory);
        this.optionsComponentRef.changeDetectorRef.detectChanges();
        this.optionsComponentRef.instance.options = this.optionsFiltered;
        this.optionsComponentRef.instance.debug = this.debug;
        // this.optionsComponentRef.instance.selectedOption = this.selectedOption;
        this.optionsComponentRef.instance.mainElement = this.container;
        this.optionsComponentRef.instance.onOptionSelected.subscribe(function (data) { return _this.optionWasSelected(data); });
        document.querySelector('body')
            .appendChild(this.optionsComponentRef.instance.optionsElement.nativeElement);
        this.updateOptionsScreenLocation();
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.removeOptionsComFromBody = function () {
        if (this.optionsComponentRef) {
            this.optionsComponentRef.destroy();
        }
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.updateOptionsScreenLocation = function () {
        var /** @type {?} */ styles = AwesomeHelper.getStylesPosition(this.container.nativeElement, '.a-typehead-multiple');
        this.optionsComponentRef.instance.style = styles;
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.focusIntoInputControl = function () {
        var _this = this;
        setTimeout(function () {
            _this.getInputControl().select();
        }, 1);
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.getInputControl = function () {
        return this.container.nativeElement.querySelector('.typehead-input');
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.getInputGroupButton = function () {
        return this.container.nativeElement.querySelector('.input-group-addon');
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.selectInputControlText = function () {
        var _this = this;
        setTimeout(function () {
            _this.getInputControl().select();
        }, 1);
    };
    /**
     * @param {?} options
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.isValueUpdateRequired = function (options) {
        // TODO
        return true;
    };
    /**
     * @param {?} text
     * @param {?} options
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.filterOptions = function (text, options) {
        var _this = this;
        if (this.debug) {
            console.log('filterOptions begin', text, options);
        }
        var /** @type {?} */ filtered = [];
        if (!text || text === '') {
            // if there is no text supplied return unfiltered options
            filtered = options;
        }
        else {
            // in all other conditions return filtered options
            filtered = options.filter(function (option) {
                // filter by text contained in the option text
                return option.text.toLowerCase().includes(text.toLowerCase());
            });
        }
        // exclude selected options from filtered value
        filtered = filtered.filter(function (filteredOption) {
            var /** @type {?} */ foundInSelected = (_this.selectedOptionsValue || []).filter(function (selectedOption) {
                return filteredOption.compare(selectedOption);
            });
            return foundInSelected.length === 0;
        });
        if (this.debug) {
            console.log('filterOptions end', filtered);
        }
        return filtered;
    };
    /**
     * @param {?} position
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.moveActiveFocus = function (position) {
        if (this.debug) {
            console.log('moveActiveFocus position', position);
        }
        var /** @type {?} */ newPos = this.activeFocusPosition;
        if (newPos === undefined) {
            newPos = 0;
        }
        else {
            newPos += position;
        }
        if (this.optionsFiltered.length < newPos + 1) {
            newPos = 0;
        }
        else if (newPos < 0) {
            newPos = this.optionsFiltered.length - 1;
        }
        this.activeFocusPosition = newPos;
        if (this.debug) {
            console.log('moveActiveFocus newPos', newPos);
        }
    };
    /**
     * @return {?}
     */
    AwesomeTypeheadMultipleComponent.prototype.matchInputWithOption = function () {
        var _this = this;
        if (!this.typeHeadValue || this.typeHeadValue === '') {
            return;
        }
        if (this.optionsFiltered && this.optionsFiltered.length === 1) {
            this.optionWasSelected(this.optionsFiltered[0]);
        }
        else {
            // if the user has typed in different casing it will automatically match with an option
            var /** @type {?} */ foundOption = this.optionsUnFiltered
                .find(function (a) { return a.text.toLocaleLowerCase() === _this.typeHeadValue.toLocaleLowerCase(); });
            if (foundOption) {
                this.optionWasSelected(foundOption);
            }
            this.typeHeadValue = '';
        }
    };
    return AwesomeTypeheadMultipleComponent;
}());
// #endregion Internal functionality
AwesomeTypeheadMultipleComponent.decorators = [
    { type: Component, args: [{
                selector: 'a-typehead-multiple',
                providers: [{
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(function () { return AwesomeTypeheadMultipleComponent; }),
                        multi: true
                    }],
                template: "\n      <div class=\"input-group a-typehead-multiple\">\n          <div class=\"form-control typehead-container\"\n              [ngClass]=\"{'focus': inputFocusedIn}\">\n              <span class=\"badge badge-secondary option\"\n                  *ngFor=\"let option of selectedOptionsValue; let index=index\">\n                  <span class=\"option-text\">{{option.text}}</span>\n                  <span class=\"option-close\"\n                      (click)=\"onOptionRemove(option)\">\n                      <i class=\"ion-close-round\"></i>\n                  </span>\n              </span>\n              <input type=\"text\" class=\"form-control typehead-input\" autocomplete=\"off\"\n                  (blur)=\"onInputBlur($event)\"\n                  (focus)=\"onInputFocus($event)\"\n                  (keydown)=\"onInputKeyPressed($event)\"\n                  (ngModelChange)=\"onInputChange($event)\"\n                  [id]=\"id\"\n                  [(ngModel)]=\"typeHeadValue\"\n                  [disabled]=\"isDisabled\"\n                  [placeholder]=\"placeholder\" />\n          </div>\n          <span class=\"input-group-btn\">\n              <button type=\"button\" class=\"btn btn-secondary typehead-btn\" (click)=\"toggleOptions()\" [disabled]=\"isDisabled\">\n                  <i class=\"dropdown-toggle\"></i>\n              </button>\n          </span>\n      </div>\n      <div *ngIf=\"debug\">debug: {{selectedOptionsValue|json}}</div>\n    ",
                styles: ["\n      .a-typehead-multiple .typehead-input {\n        border: none;\n        -webkit-box-shadow: none;\n                box-shadow: none;\n        min-width: 100px;\n        float: left; }\n\n      .a-typehead-multiple .typehead-container {\n        padding: 0;\n        display: block; }\n\n      .a-typehead-multiple .typehead-btn {\n        height: 100%; }\n\n      .a-typehead-multiple .option {\n        font-size: 1rem;\n        margin: 5px 0 0px 5px;\n        position: relative;\n        padding-right: 17px;\n        float: left; }\n        .a-typehead-multiple .option > .option-close {\n          position: absolute;\n          right: 5px;\n          top: 5px;\n          cursor: pointer;\n          font-size: 0.8rem; }\n    "]
            },] },
];
/**
 * @nocollapse
 */
AwesomeTypeheadMultipleComponent.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: ElementRef, },
    { type: ComponentFactoryResolver, },
    { type: ViewContainerRef, },
]; };
AwesomeTypeheadMultipleComponent.propDecorators = {
    'formControl': [{ type: Input },],
    'idField': [{ type: Input },],
    'textField': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'id': [{ type: Input },],
    'debug': [{ type: Input },],
    'options': [{ type: Input },],
    'selectedOptions': [{ type: Input },],
    'optionsOpened': [{ type: Input },],
    'filterDelayMs': [{ type: Input },],
    'onHelperButtonClick': [{ type: Output },],
    'onOptionSelected': [{ type: Output },],
};
var AwesomeTypeheadModule = (function () {
    function AwesomeTypeheadModule() {
    }
    return AwesomeTypeheadModule;
}());
AwesomeTypeheadModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule
                ],
                declarations: [
                    AwesomeTypeheadComponent,
                    AwesomeTypeheadMultipleComponent,
                    AwesomeOptionsComponent
                ],
                providers: [],
                exports: [
                    AwesomeTypeheadComponent,
                    AwesomeTypeheadMultipleComponent,
                    AwesomeOptionsComponent
                ],
                entryComponents: [
                    AwesomeTypeheadComponent,
                    AwesomeTypeheadMultipleComponent,
                    AwesomeOptionsComponent
                ],
            },] },
];
/**
 * @nocollapse
 */
AwesomeTypeheadModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { AwesomeTypeheadModule, AwesomeOptionsComponent as ɵc, AwesomeTypeheadMultipleComponent as ɵb, AwesomeTypeheadComponent as ɵa };
//# sourceMappingURL=awesome-typehead.es5.js.map
