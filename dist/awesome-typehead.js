import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, NgModule, Output, ViewContainerRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { Subject as Subject$1 } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

class AwesomeOptionsComponent {
    /**
     * @param {?} optionsElement
     */
    constructor(optionsElement) {
        this.optionsElement = optionsElement;
        this.debug = false;
        this.helperButton = 'test';
        this.onOptionSelected = new EventEmitter();
        this.onMouseEnter = new EventEmitter();
        this.onHelperButtonClick = new EventEmitter();
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set options(val) {
        this._options = val;
    }
    /**
     * @param {?} style
     * @return {?}
     */
    set style(style) {
        this.optionsElement.nativeElement.setAttribute('style', style);
    }
    /**
     * @return {?}
     */
    get options() {
        return this._options;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @param {?} option
     * @return {?}
     */
    selectOption(option) {
        this.onOptionSelected.emit(option);
    }
    /**
     * @param {?} option
     * @return {?}
     */
    isOptionSelected(option) {
        if (!this.selectedOption) {
            return false;
        }
        if (typeof option === 'object') {
            return option.text === this.selectedOption.text;
        }
        else {
            return option === this.selectedOption;
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onMouseEntered($event) {
        this.onMouseEnter.emit($event);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onHelperButtonClickHandler($event) {
        this.onHelperButtonClick.emit($event);
    }
}
AwesomeOptionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'a-options',
                template: `
      <div class="a-options"
          (mouseenter)="onMouseEntered($event)" >
          <ul class="dropdown-menu show">
              <li class="hidden">
                  <a href="javascript:void(0);" class="dropdown-item"
                      *ngIf="helperButton"
                      (click)="onHelperButtonClickHandler($event)">{{helperButton}}</a>
              </li>
              <li *ngFor="let option of options; let index=index">
                  <a href="javascript:void(0);" class="dropdown-item" (click)="selectOption(option)"
                      [ngClass]="{'active': isOptionSelected(option), 'hover': index === activeFocusPosition && !isOptionSelected(option)}">
                      {{option.text}}
                  </a>
              </li>
              <li *ngIf="!options || options.length === 0">
                  <div class="text-center">No matches</div>
              </li>
          </ul>
      </div>
    `,
                styles: [`
      .a-options > ul {
        width: 100%; }

      .a-options > ul > li > a {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem; }
        .a-options > ul > li > a.hover {
          background-color: rgba(162, 162, 162, 0.1);
          color: inherit; }
    `]
            },] },
];
/**
 * @nocollapse
 */
AwesomeOptionsComponent.ctorParameters = () => [
    { type: ElementRef, },
];
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

class AwesomeHelper {
    /**
     * @param {?} options
     * @param {?} textField
     * @param {?} idField
     * @return {?}
     */
    static toAwesomeOptions(options, textField, idField) {
        if (!options) {
            return null;
        }
        const /** @type {?} */ awesomeOptions = [];
        options.forEach((option) => {
            awesomeOptions.push(new AwesomeOption(textField, idField, option));
        });
        return awesomeOptions;
    }
    /**
     * @param {?} awesomeOptions
     * @return {?}
     */
    static fromAwesomeOptions(awesomeOptions) {
        if (!awesomeOptions) {
            return null;
        }
        const /** @type {?} */ options = [];
        awesomeOptions.forEach((option) => {
            options.push(option.model);
        });
        return options;
    }
    /**
     * @param {?} element
     * @param {?} query
     * @return {?}
     */
    static getStylesPosition(element, query) {
        const /** @type {?} */ clientRect = element
            .querySelector(query)
            .getBoundingClientRect();
        const /** @type {?} */ width = clientRect.width;
        const /** @type {?} */ height = clientRect.height;
        const /** @type {?} */ leftOffset = clientRect.left;
        const /** @type {?} */ topOffset = clientRect.top + height + window.pageYOffset;
        return `position: absolute;
                width: ${width}px;
                left: ${leftOffset}px;
                top: ${topOffset}px;
                z-index: 100000;`;
    }
    /**
     * @param {?} text
     * @return {?}
     */
    static stringToLowerSafely(text) {
        if (!text) {
            return text;
        }
        else {
            return text.toLowerCase();
        }
    }
}

class AwesomeOption {
    /**
     * @param {?=} textField
     * @param {?=} idField
     * @param {?=} model
     * @param {?=} simpleText
     */
    constructor(textField, idField, model, simpleText) {
        this.textField = textField;
        this.idField = idField;
        this.model = model;
        this.simpleText = simpleText;
    }
    /**
     * @return {?}
     */
    get text() {
        if (this.model && this.textField) {
            return this.model[this.textField];
        }
        else if (this.simpleText) {
            return this.simpleText;
        }
        else {
            return null;
        }
    }
    /**
     * @return {?}
     */
    get id() {
        if (this.model && this.idField) {
            return this.model[this.idField];
        }
        else {
            return null;
        }
    }
    /**
     * @param {?} newValue
     * @return {?}
     */
    compare(newValue) {
        if (!newValue) {
            return false;
        }
        const /** @type {?} */ curText = AwesomeHelper.stringToLowerSafely(this.text);
        const /** @type {?} */ curId = this.id;
        if (newValue instanceof AwesomeOption) {
            const /** @type {?} */ newText = AwesomeHelper.stringToLowerSafely(newValue.text);
            const /** @type {?} */ newId = newValue.id;
            return curText === newText && curId === newId;
        }
        else {
            const /** @type {?} */ newText = AwesomeHelper.stringToLowerSafely(newValue[this.textField]);
            const /** @type {?} */ newId = newValue[this.idField];
            return curText === newText && this.id === newId;
        }
    }
}

const noop = () => { };
class AwesomeTypeheadComponent {
    /**
     * @param {?} container
     * @param {?} optionsElement
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     */
    constructor(container, optionsElement, componentFactoryResolver, viewContainerRef) {
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
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        this.optionsRaw = options;
        this.setOptions(options);
    }
    /**
     * @param {?} option
     * @return {?}
     */
    set selectedOption(option) {
        this.setSelectedOption(option);
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set optionsOpened(val) {
        this._optionsOpened = val;
    }
    /**
     * @return {?}
     */
    get selectedOption() {
        return this._selectedOption;
    }
    /**
     * @return {?}
     */
    get optionsOpened() {
        return this._optionsOpened;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
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
                .switchMap(term => {
                return Observable$1.of(this.filterOptions(term, this.optionsUnFiltered));
            });
            // update filtered options
            this.optionsFilterObservable.subscribe((data) => {
                if (this.debug) {
                    console.log('filtered', data, this.optionsFiltered, this.optionsUnFiltered);
                }
                this.optionsFiltered = data;
                this.optionsComponentRef.instance.options = data;
            });
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.removeOptionsComFromBody();
    }
    /**
     * @param {?} val
     * @return {?}
     */
    writeValue(val) {
        if (this.isValueUpdateRequired(val)) {
            this.setSelectedOption(val, false);
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.isDisabled = isDisabled;
    }
    /**
     * @return {?}
     */
    toggleOptions() {
        if (this._optionsOpened === true) {
            this.closeOptions();
        }
        else {
            this.optionsFilterTerms.next(this.typeHeadValue);
            this.openOptions();
            this.focusIntoInputControl();
        }
    }
    /**
     * @return {?}
     */
    openOptions() {
        this._optionsOpened = true;
        this.appendOptionsCompToBody();
        this.bindEvents();
    }
    /**
     * @return {?}
     */
    closeOptions() {
        this.removeOptionsComFromBody();
        this._optionsOpened = false;
        this.activeFocusPosition = undefined;
        this.unBindEvents();
    }
    /**
     * @return {?}
     */
    focusIntoInputControl() {
        setTimeout(() => {
            this.getInputControl().select();
        }, 1);
    }
    /**
     * @return {?}
     */
    selectInputControlText() {
        setTimeout(() => {
            this.getInputControl().select();
        }, 1);
    }
    /**
     * @param {?} option
     * @return {?}
     */
    optionWasSelected(option) {
        if (this.debug) {
            console.log('onOptionSelected', option);
        }
        this.selectedOption = option;
        this.closeOptions();
        if (option) {
            this.selectInputControlText();
            this.onOptionSelected.emit(option.model);
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputBlur($event) {
        if (!this.selectedOption || (this.selectedOption.text !== this.typeHeadValue)) {
            this.matchInputWithOption();
        }
        setTimeout(() => {
            if (this.debug) {
                console.log('onInputBlur');
            }
            // close the options if active focus is not inside the element
            if ((document.activeElement !== this.getInputGroupButton()) && (document.activeElement !== this.getInputControl())) {
                this.closeOptions();
            }
            this.onTouched();
        }, 250);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputKeyPressed($event) {
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
                    const /** @type {?} */ selectedOption = this.optionsFiltered[this.activeFocusPosition];
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
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onOptionsMouseEntered($event) {
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputGroupMouseEntered($event) {
    }
    /**
     * @return {?}
     */
    onWindowScrollOrResize() {
        this.updateOptionsScreenLocation();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onBodyClick($event) {
        // find if the click has occured inside of the container or options elements
        let /** @type {?} */ matchingElement = $event.path.indexOf(this.container.nativeElement);
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
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputChange($event) {
        if (this.debug) {
            console.log('onInputChange', $event);
        }
        // open options dropdown if it was closed
        if (!this.optionsOpened) {
            this.openOptions();
        }
        // insert term into routine call
        this.optionsFilterTerms.next($event);
    }
    /**
     * @return {?}
     */
    appendOptionsCompToBody() {
        const /** @type {?} */ factory = this.componentFactoryResolver.resolveComponentFactory(AwesomeOptionsComponent);
        this.optionsComponentRef = this.viewContainerRef.createComponent(factory);
        this.optionsComponentRef.changeDetectorRef.detectChanges();
        this.optionsComponentRef.instance.options = this.optionsFiltered;
        this.optionsComponentRef.instance.debug = this.debug;
        this.optionsComponentRef.instance.selectedOption = this.selectedOption;
        this.optionsComponentRef.instance.mainElement = this.container;
        this.optionsComponentRef.instance.helperButton = this.helperButton;
        this.optionsComponentRef.instance.onOptionSelected.subscribe(data => this.optionWasSelected(data));
        this.optionsComponentRef.instance.onHelperButtonClick.subscribe(data => this.onHelperButtonClick.emit(data));
        document.querySelector('body')
            .appendChild(this.optionsComponentRef.instance.optionsElement.nativeElement);
        this.updateOptionsScreenLocation();
    }
    /**
     * @return {?}
     */
    removeOptionsComFromBody() {
        if (this.optionsComponentRef) {
            this.optionsComponentRef.destroy();
        }
    }
    /**
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        if (this.debug) {
            console.log('setOptions', options);
        }
        if (!options) {
            this.optionsUnFiltered = [];
        }
        else {
            const /** @type {?} */ awesomeOptions = AwesomeHelper
                .toAwesomeOptions(options, this.textField, this.idField);
            this.optionsUnFiltered = awesomeOptions;
            this.optionsFiltered = awesomeOptions;
        }
    }
    /**
     * @param {?} option
     * @param {?=} updateFormControl
     * @return {?}
     */
    setSelectedOption(option, updateFormControl = true) {
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
                const /** @type {?} */ awesomeOption = new AwesomeOption(this.textField, this.idField, option);
                this.updateSelectedOptionValue(awesomeOption, awesomeOption.text, updateFormControl);
            }
            else {
                const /** @type {?} */ awesomeOption = new AwesomeOption(null, null, null, option);
                this.updateSelectedOptionValue(awesomeOption.text, awesomeOption.text, updateFormControl);
            }
        }
    }
    /**
     * @param {?} objValue
     * @param {?} textValue
     * @param {?=} updateFormControl
     * @return {?}
     */
    updateSelectedOptionValue(objValue, textValue, updateFormControl = true) {
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
    }
    /**
     * @return {?}
     */
    matchInputWithOption() {
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
            const /** @type {?} */ foundOption = this.optionsUnFiltered
                .find((a) => a.text.toLocaleLowerCase() === this.typeHeadValue.toLocaleLowerCase());
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
    }
    /**
     * @return {?}
     */
    updateOptionsScreenLocation() {
        const /** @type {?} */ clientRect = this.container.nativeElement
            .querySelector('.a-typehead')
            .getBoundingClientRect();
        const /** @type {?} */ width = clientRect.width;
        const /** @type {?} */ height = clientRect.height;
        const /** @type {?} */ leftOffset = clientRect.left;
        const /** @type {?} */ topOffset = clientRect.top + height + window.pageYOffset;
        this.optionsComponentRef.instance.style =
            `position: absolute;
            width: ${width}px;
            left: ${leftOffset}px;
            top: ${topOffset}px;
            z-index: 10000`;
    }
    /**
     * @return {?}
     */
    getInputControl() {
        return this.container.nativeElement.querySelector('.form-control');
    }
    /**
     * @return {?}
     */
    getInputGroupButton() {
        return this.container.nativeElement.querySelector('.input-group-addon');
    }
    /**
     * @return {?}
     */
    bindEvents() {
        window.addEventListener('scroll', this.onWindowScrollOrResizeDelegate, true);
        window.addEventListener('resize', this.onWindowScrollOrResizeDelegate, true);
        document.addEventListener('click', this.onBodyClickDelegate, true);
    }
    /**
     * @return {?}
     */
    unBindEvents() {
        window.removeEventListener('scroll', this.onWindowScrollOrResizeDelegate, true);
        window.removeEventListener('resize', this.onWindowScrollOrResizeDelegate, true);
        document.removeEventListener('click', this.onBodyClickDelegate, true);
    }
    /**
     * @param {?} option
     * @return {?}
     */
    isValueUpdateRequired(option) {
        return ((this._selectedOption && !this._selectedOption.compare(option))
            || (!this._selectedOption && option));
    }
    /**
     * @param {?} text
     * @param {?} options
     * @return {?}
     */
    filterOptions(text, options) {
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
            return options.filter((option) => {
                // filter by text contained in the option text
                return option.text.toLowerCase().includes(text.toLowerCase());
            });
        }
    }
    /**
     * @param {?} position
     * @return {?}
     */
    moveActiveFocus(position) {
        if (this.debug) {
            console.log('moveActiveFocus position', position);
        }
        let /** @type {?} */ newPos = this.activeFocusPosition;
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
    }
}
AwesomeTypeheadComponent.decorators = [
    { type: Component, args: [{
                selector: 'a-typehead',
                providers: [{
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => AwesomeTypeheadComponent),
                        multi: true
                    }],
                template: `
      <div class="input-group a-typehead"
          (mouseenter)="onInputGroupMouseEntered($event)">
          <input type="text" class="form-control" autocomplete="off"
              (blur)="onInputBlur($event)"
              (keydown)="onInputKeyPressed($event)"
              (ngModelChange)="onInputChange($event)"
              [id]="id"
              [(ngModel)]="typeHeadValue"
              [disabled]="isDisabled" />
          <input type="hidden" [formControl]="formControl" />
          <span class="input-group-btn">
              <button type="button" class="btn btn-secondary" (click)="toggleOptions()" [disabled]="isDisabled">
                  <i class="dropdown-toggle"></i>
              </button>
          </span>
      </div>
      <div *ngIf="debug">debug: {{_selectedOption|json}}</div>
    `,
                styles: [`

    `]
            },] },
];
/**
 * @nocollapse
 */
AwesomeTypeheadComponent.ctorParameters = () => [
    { type: ElementRef, },
    { type: ElementRef, },
    { type: ComponentFactoryResolver, },
    { type: ViewContainerRef, },
];
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

const noop$1 = () => { };
class AwesomeTypeheadMultipleComponent {
    /**
     * @param {?} container
     * @param {?} optionsElement
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     */
    constructor(container, optionsElement, componentFactoryResolver, viewContainerRef) {
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
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        this.optionsRaw = options;
        this.setOptions(options);
    }
    /**
     * @param {?} options
     * @return {?}
     */
    set selectedOptions(options) {
        this.setSelectedOptions(options);
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set optionsOpened(val) {
        this.optionsDropOpen = val;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    writeValue(val) {
        if (this.isValueUpdateRequired(val)) {
            this.setSelectedOptions(val, false);
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.isDisabled = isDisabled;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        {
            // run the filter search with debounce time configured in the component
            this.optionsFilterObservable = this.optionsFilterTerms
                .debounceTime(this.filterDelayMs)
                .switchMap(term => {
                return Observable$1.of(this.filterOptions(term, this.optionsUnFiltered));
            });
            // update filtered options
            this.optionsFilterObservable.subscribe((data) => {
                if (this.debug) {
                    console.log('filtered', data, this.optionsFiltered, this.optionsUnFiltered);
                }
                this.optionsFiltered = data;
                this.optionsComponentRef.instance.options = data;
            });
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.removeOptionsComFromBody();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputBlur($event) {
        this.toggleClassOnFocus();
        if (this.debug) {
            console.log('onInputBlur');
        }
        setTimeout(() => {
            // close the options if active focus is not inside the element
            if ((document.activeElement !== this.getInputGroupButton()) &&
                (document.activeElement !== this.getInputControl())) {
                this.closeOptions();
            }
            this.onTouched();
        }, 250);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputFocus($event) {
        this.toggleClassOnFocus();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputKeyPressed($event) {
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
                    const /** @type {?} */ selectedOption = this.optionsFiltered[this.activeFocusPosition];
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
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputChange($event) {
        if (this.debug) {
            console.log('onInputChange', $event);
        }
        // open options dropdown if it was closed
        if (!this.optionsDropOpen) {
            this.openOptions();
        }
        // insert term into routine call
        this.optionsFilterTerms.next($event);
    }
    /**
     * @param {?} option
     * @return {?}
     */
    optionWasSelected(option) {
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
            this.onOptionSelected.emit(this.selectedOptionsValue.map((opt) => {
                return opt.model;
            }));
        }
    }
    /**
     * @param {?} option
     * @return {?}
     */
    onOptionRemove(option) {
        if (this.debug) {
            console.log('onOptionRemove', option);
        }
        this.selectedOptionsValue = this.selectedOptionsValue.filter((filteredOption) => {
            return filteredOption.compare(option) === false;
        });
        this.setSelectedOptions(this.selectedOptionsValue);
    }
    /**
     * @return {?}
     */
    onWindowScrollOrResize() {
        this.updateOptionsScreenLocation();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onBodyClick($event) {
        // find if the click has occured inside of the container or options elements
        let /** @type {?} */ matchingElement = $event.path.indexOf(this.container.nativeElement);
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
    }
    /**
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        if (this.debug) {
            console.log('setOptions', options);
        }
        if (!options) {
            this.optionsUnFiltered = [];
        }
        else {
            const /** @type {?} */ awesomeOptions = AwesomeHelper
                .toAwesomeOptions(options, this.textField, this.idField);
            this.optionsUnFiltered = awesomeOptions;
            this.optionsFiltered = awesomeOptions;
        }
    }
    /**
     * @param {?} options
     * @param {?=} updateFormControl
     * @return {?}
     */
    setSelectedOptions(options, updateFormControl = true) {
        if (this.debug) {
            console.log('setSelectedOptions', options, updateFormControl);
        }
        if (!options || options.length === 0) {
            this.updateSelectedOptionsValue(null, updateFormControl);
            return;
        }
        const /** @type {?} */ needToConvert = !(options[0] instanceof AwesomeOption);
        const /** @type {?} */ awesomeOptions = needToConvert ? [] : options;
        if (needToConvert) {
            options.forEach(option => {
                let /** @type {?} */ aOption;
                if (typeof option === 'object') {
                    aOption = new AwesomeOption(this.textField, this.idField, option);
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
    }
    /**
     * @param {?} arrayValue
     * @param {?=} updateFormControl
     * @return {?}
     */
    updateSelectedOptionsValue(arrayValue, updateFormControl = true) {
        if (this.debug) {
            console.log('updateSelectedOptionsValue', arrayValue, updateFormControl);
        }
        this.selectedOptionsValue = arrayValue;
        this.typeHeadValue = '';
        if (updateFormControl) {
            const /** @type {?} */ options = AwesomeHelper.fromAwesomeOptions(arrayValue);
            this.formControl.setValue(options);
            this.onChange(options);
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    toggleOptions($event) {
        if (this.optionsDropOpen === true) {
            this.closeOptions();
        }
        else {
            this.optionsFilterTerms.next(this.typeHeadValue);
            this.openOptions();
            this.focusIntoInputControl();
        }
    }
    /**
     * @return {?}
     */
    toggleClassOnFocus() {
        this.inputFocusedIn = !this.inputFocusedIn;
    }
    /**
     * @return {?}
     */
    openOptions() {
        this.optionsDropOpen = true;
        this.appendOptionsCompToBody();
        this.bindEvents();
    }
    /**
     * @return {?}
     */
    closeOptions() {
        this.removeOptionsComFromBody();
        this.optionsDropOpen = false;
        this.activeFocusPosition = undefined;
        this.unBindEvents();
    }
    /**
     * @return {?}
     */
    bindEvents() {
        window.addEventListener('scroll', this.onWindowScrollOrResizeDelegate, true);
        window.addEventListener('resize', this.onWindowScrollOrResizeDelegate, true);
        document.addEventListener('click', this.onBodyClickDelegate, true);
    }
    /**
     * @return {?}
     */
    unBindEvents() {
        window.removeEventListener('scroll', this.onWindowScrollOrResizeDelegate, true);
        window.removeEventListener('resize', this.onWindowScrollOrResizeDelegate, true);
        document.removeEventListener('click', this.onBodyClickDelegate, true);
    }
    /**
     * @return {?}
     */
    appendOptionsCompToBody() {
        const /** @type {?} */ factory = this.componentFactoryResolver.resolveComponentFactory(AwesomeOptionsComponent);
        this.optionsComponentRef = this.viewContainerRef.createComponent(factory);
        this.optionsComponentRef.changeDetectorRef.detectChanges();
        this.optionsComponentRef.instance.options = this.optionsFiltered;
        this.optionsComponentRef.instance.debug = this.debug;
        // this.optionsComponentRef.instance.selectedOption = this.selectedOption;
        this.optionsComponentRef.instance.mainElement = this.container;
        this.optionsComponentRef.instance.onOptionSelected.subscribe(data => this.optionWasSelected(data));
        document.querySelector('body')
            .appendChild(this.optionsComponentRef.instance.optionsElement.nativeElement);
        this.updateOptionsScreenLocation();
    }
    /**
     * @return {?}
     */
    removeOptionsComFromBody() {
        if (this.optionsComponentRef) {
            this.optionsComponentRef.destroy();
        }
    }
    /**
     * @return {?}
     */
    updateOptionsScreenLocation() {
        const /** @type {?} */ styles = AwesomeHelper.getStylesPosition(this.container.nativeElement, '.a-typehead-multiple');
        this.optionsComponentRef.instance.style = styles;
    }
    /**
     * @return {?}
     */
    focusIntoInputControl() {
        setTimeout(() => {
            this.getInputControl().select();
        }, 1);
    }
    /**
     * @return {?}
     */
    getInputControl() {
        return this.container.nativeElement.querySelector('.typehead-input');
    }
    /**
     * @return {?}
     */
    getInputGroupButton() {
        return this.container.nativeElement.querySelector('.input-group-addon');
    }
    /**
     * @return {?}
     */
    selectInputControlText() {
        setTimeout(() => {
            this.getInputControl().select();
        }, 1);
    }
    /**
     * @param {?} options
     * @return {?}
     */
    isValueUpdateRequired(options) {
        // TODO
        return true;
    }
    /**
     * @param {?} text
     * @param {?} options
     * @return {?}
     */
    filterOptions(text, options) {
        if (this.debug) {
            console.log('filterOptions begin', text, options);
        }
        let /** @type {?} */ filtered = [];
        if (!text || text === '') {
            // if there is no text supplied return unfiltered options
            filtered = options;
        }
        else {
            // in all other conditions return filtered options
            filtered = options.filter((option) => {
                // filter by text contained in the option text
                return option.text.toLowerCase().includes(text.toLowerCase());
            });
        }
        // exclude selected options from filtered value
        filtered = filtered.filter((filteredOption) => {
            const /** @type {?} */ foundInSelected = (this.selectedOptionsValue || []).filter((selectedOption) => {
                return filteredOption.compare(selectedOption);
            });
            return foundInSelected.length === 0;
        });
        if (this.debug) {
            console.log('filterOptions end', filtered);
        }
        return filtered;
    }
    /**
     * @param {?} position
     * @return {?}
     */
    moveActiveFocus(position) {
        if (this.debug) {
            console.log('moveActiveFocus position', position);
        }
        let /** @type {?} */ newPos = this.activeFocusPosition;
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
    }
    /**
     * @return {?}
     */
    matchInputWithOption() {
        if (!this.typeHeadValue || this.typeHeadValue === '') {
            return;
        }
        if (this.optionsFiltered && this.optionsFiltered.length === 1) {
            this.optionWasSelected(this.optionsFiltered[0]);
        }
        else {
            // if the user has typed in different casing it will automatically match with an option
            const /** @type {?} */ foundOption = this.optionsUnFiltered
                .find((a) => a.text.toLocaleLowerCase() === this.typeHeadValue.toLocaleLowerCase());
            if (foundOption) {
                this.optionWasSelected(foundOption);
            }
            this.typeHeadValue = '';
        }
    }
}
// #endregion Internal functionality
AwesomeTypeheadMultipleComponent.decorators = [
    { type: Component, args: [{
                selector: 'a-typehead-multiple',
                providers: [{
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => AwesomeTypeheadMultipleComponent),
                        multi: true
                    }],
                template: `
      <div class="input-group a-typehead-multiple">
          <div class="form-control typehead-container"
              [ngClass]="{'focus': inputFocusedIn}">
              <span class="badge badge-secondary option"
                  *ngFor="let option of selectedOptionsValue; let index=index">
                  <span class="option-text">{{option.text}}</span>
                  <span class="option-close"
                      (click)="onOptionRemove(option)">
                      <i class="ion-close-round"></i>
                  </span>
              </span>
              <input type="text" class="form-control typehead-input" autocomplete="off"
                  (blur)="onInputBlur($event)"
                  (focus)="onInputFocus($event)"
                  (keydown)="onInputKeyPressed($event)"
                  (ngModelChange)="onInputChange($event)"
                  [id]="id"
                  [(ngModel)]="typeHeadValue"
                  [disabled]="isDisabled"
                  [placeholder]="placeholder" />
          </div>
          <span class="input-group-btn">
              <button type="button" class="btn btn-secondary typehead-btn" (click)="toggleOptions()" [disabled]="isDisabled">
                  <i class="dropdown-toggle"></i>
              </button>
          </span>
      </div>
      <div *ngIf="debug">debug: {{selectedOptionsValue|json}}</div>
    `,
                styles: [`
      .a-typehead-multiple .typehead-input {
        border: none;
        -webkit-box-shadow: none;
                box-shadow: none;
        min-width: 100px;
        float: left; }

      .a-typehead-multiple .typehead-container {
        padding: 0;
        display: block; }

      .a-typehead-multiple .typehead-btn {
        height: 100%; }

      .a-typehead-multiple .option {
        font-size: 1rem;
        margin: 5px 0 0px 5px;
        position: relative;
        padding-right: 17px;
        float: left; }
        .a-typehead-multiple .option > .option-close {
          position: absolute;
          right: 5px;
          top: 5px;
          cursor: pointer;
          font-size: 0.8rem; }
    `]
            },] },
];
/**
 * @nocollapse
 */
AwesomeTypeheadMultipleComponent.ctorParameters = () => [
    { type: ElementRef, },
    { type: ElementRef, },
    { type: ComponentFactoryResolver, },
    { type: ViewContainerRef, },
];
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

class AwesomeTypeheadModule {
}
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
AwesomeTypeheadModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { AwesomeTypeheadModule, AwesomeOptionsComponent as ɵc, AwesomeTypeheadMultipleComponent as ɵb, AwesomeTypeheadComponent as ɵa };
//# sourceMappingURL=awesome-typehead.js.map
