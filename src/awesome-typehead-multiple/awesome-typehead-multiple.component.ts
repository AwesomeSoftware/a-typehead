import { Component, Input, OnInit, ElementRef, forwardRef, ComponentFactoryResolver,
    ViewContainerRef, ComponentRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { AwesomeOptionsComponent } from '../awesome-options/awesome-options.component';
import { AwesomeOption } from './../shared/awesome-option';
import { AwesomeHelper } from '../shared/awesome-helper';

const noop = () => {};

@Component({
    selector: 'a-typehead-multiple',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AwesomeTypeheadMultipleComponent),
        multi: true
    }],
    templateUrl: './awesome-typehead-multiple.component.html',
    styleUrls: ['./awesome-typehead-multiple.component.scss']
})

export class AwesomeTypeheadMultipleComponent implements OnInit, OnDestroy, ControlValueAccessor {
    // #region Input fields
    @Input() public formControl: FormControl = new FormControl();
    @Input() public idField = 'id';
    @Input() public textField = 'text';
    @Input() public placeholder = '';
    @Input() public id = Math.random();
    @Input() public debug = false;
    @Input() public set options(options: any[]) {
        this.optionsRaw = options;
        this.setOptions(options);
    }
    @Input() public set selectedOptions(options: any[]) {
        this.setSelectedOptions(options);
    }
    @Input() public set optionsOpened(val: boolean) {
        this.optionsDropOpen = val;
    }
    @Input() public filterDelayMs = 50;
    // #endregion Input fields

    // #region Output events
    @Output() public onHelperButtonClick = new EventEmitter<any>();
    @Output() public onOptionSelected = new EventEmitter<any>();
    // #endregion Output events

    // #region Private fields
    private isDisabled = false;
    private optionsDropOpen = false;
    private inputFocusedIn = false;

    private optionsRaw: any[] = [];
    private optionsUnFiltered: AwesomeOption[] = [];
    private optionsFiltered: AwesomeOption[] = [];

    private selectedOptionsValue: AwesomeOption[] = [];

    private typeHeadValue: string;
    private activeFocusPosition: number;

    private optionsComponentRef: ComponentRef<AwesomeOptionsComponent>;
    private optionsFilterObservable: Observable<AwesomeOption[]>;

    private onWindowScrollOrResizeDelegate: any = this.onWindowScrollOrResize.bind(this);
    private onBodyClickDelegate: any = this.onBodyClick.bind(this);

    private optionsFilterTerms = new Subject<string>();
    // #endregion Private fields

    // #region ControlValueAccessor interface
    private onChange: (_: any) => void = noop;

    private onTouched: () => void = noop;

    writeValue(val: any): void {
        if (this.isValueUpdateRequired(val)) {
            this.setSelectedOptions(val, false);
        }
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    // #endregion ControlValueAccessor interface

    // #region Constructor & ngOn
    constructor(public container: ElementRef,
        public optionsElement: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef) {}

    ngOnInit() {
        if (false) {
            // TODO develop filtering on backend
            // it should execute the routine for requesting data
            // and show the spinner while this is loading
        } else {
            // run the filter search with debounce time configured in the component
            this.optionsFilterObservable = this.optionsFilterTerms
                .debounceTime(this.filterDelayMs)
                .switchMap(term => {
                    return Observable.of(this.filterOptions(term, this.optionsUnFiltered));
                });
            // update filtered options
            this.optionsFilterObservable.subscribe((data: AwesomeOption[]) => {
                if (this.debug) {
                    console.log('filtered', data, this.optionsFiltered, this.optionsUnFiltered);
                }
                this.optionsFiltered = data;
                this.optionsComponentRef.instance.options = data;
            });
        }
    }
    ngOnDestroy() {
        this.removeOptionsComFromBody();
    }
    // #endregion Constructor & ngOn

    // #region Event handlers
    private onInputBlur($event) {
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

    private onInputFocus($event: Event) {
        this.toggleClassOnFocus();
    }

    private onInputKeyPressed($event) {
        switch ($event.keyCode) {
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            case 38: // up arrow
            case 40: // down arrow
                $event.preventDefault();
                // open options dropdown if it was closed
                if (!this.optionsDropOpen) {
                    this.openOptions();
                }
                // move the active option line
                if ($event.keyCode === 38) {
                    this.moveActiveFocus(-1);
                } else if ($event.keyCode === 40) {
                    this.moveActiveFocus(+1);
                }
                this.optionsComponentRef.instance.activeFocusPosition = this.activeFocusPosition;
                break;
            case 27: // escape
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
            case 13: // enter
                $event.preventDefault();
                if (this.activeFocusPosition !== undefined) {
                    const selectedOption = this.optionsFiltered[this.activeFocusPosition];
                    this.optionWasSelected(selectedOption);
                    this.activeFocusPosition = undefined;
                    this.closeOptions();
                    this.focusIntoInputControl();
                } else {
                    this.matchInputWithOption();
                }
                break;
        }
    }

    private onInputChange($event) {
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

    private optionWasSelected(option: AwesomeOption) {
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
            this.onOptionSelected.emit(this.selectedOptionsValue.map((opt: AwesomeOption) => {
                return opt.model;
            }));
        }
    }

    private onOptionRemove(option: AwesomeOption) {
        if (this.debug) {
            console.log('onOptionRemove', option);
        }
        this.selectedOptionsValue = this.selectedOptionsValue.filter((filteredOption: AwesomeOption) => {
            return filteredOption.compare(option) === false;
        });
        this.setSelectedOptions(this.selectedOptionsValue);
    }

    private onWindowScrollOrResize() {
        this.updateOptionsScreenLocation();
    }

    private onBodyClick($event) {
        // find if the click has occured inside of the container or options elements
        let matchingElement = $event.path.indexOf(this.container.nativeElement);
        if (matchingElement === -1) {
            matchingElement = $event.path.indexOf(this.optionsComponentRef.instance.optionsElement.nativeElement);
        }
        // if the click was outside of either component elements ignore and prevent the event
        // otherwise close the options
        if (matchingElement !== -1) {
            $event.preventDefault();
            return;
        } else {
            this.closeOptions();
        }
    }
    // #endregion Event handlers

    // #region Internal functionality
    private setOptions(options: any[]) {
        if (this.debug) {
            console.log('setOptions', options);
        }
        if (!options) {
            this.optionsUnFiltered = [];
        } else {
            const awesomeOptions: AwesomeOption[] = AwesomeHelper
                .toAwesomeOptions(options, this.textField, this.idField);
            this.optionsUnFiltered = awesomeOptions;
            this.optionsFiltered = awesomeOptions;
        }
    }

    private setSelectedOptions(options: any[], updateFormControl = true) {
        if (this.debug) {
            console.log('setSelectedOptions', options, updateFormControl);
        }
        if (!options || options.length === 0) {
            this.updateSelectedOptionsValue(null, updateFormControl);
            return;
        }
        const needToConvert = !(options[0] instanceof AwesomeOption);
        const awesomeOptions = needToConvert ? [] : options;
        if (needToConvert) {
            options.forEach(option => {
                let aOption: AwesomeOption;
                if (typeof option === 'object') {
                    aOption = new AwesomeOption(this.textField, this.idField, option);
                } else {
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

    private updateSelectedOptionsValue(arrayValue: any, updateFormControl = true) {
        if (this.debug) {
            console.log('updateSelectedOptionsValue', arrayValue, updateFormControl);
        }
        this.selectedOptionsValue = arrayValue;
        this.typeHeadValue = '';
        if (updateFormControl) {
            const options = AwesomeHelper.fromAwesomeOptions(arrayValue);
            this.formControl.setValue(options);
            this.onChange(options);
        }
    }

    private toggleOptions($event) {
        if (this.optionsDropOpen === true) {
            this.closeOptions();
        } else {
            this.optionsFilterTerms.next(this.typeHeadValue);
            this.openOptions();
            this.focusIntoInputControl();
        }
    }

    private toggleClassOnFocus() {
        this.inputFocusedIn = !this.inputFocusedIn;
    }

    private openOptions() {
        this.optionsDropOpen = true;
        this.appendOptionsCompToBody();
        this.bindEvents();
    }

    private closeOptions() {
        this.removeOptionsComFromBody();
        this.optionsDropOpen = false;
        this.activeFocusPosition = undefined;
        this.unBindEvents();
    }

    private bindEvents() {
        window.addEventListener('scroll', this.onWindowScrollOrResizeDelegate, true);
        window.addEventListener('resize', this.onWindowScrollOrResizeDelegate, true);
        document.addEventListener('click', this.onBodyClickDelegate, true);
    }

    private unBindEvents() {
        window.removeEventListener('scroll', this.onWindowScrollOrResizeDelegate, true);
        window.removeEventListener('resize', this.onWindowScrollOrResizeDelegate, true);
        document.removeEventListener('click', this.onBodyClickDelegate, true);
    }

    private appendOptionsCompToBody() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(AwesomeOptionsComponent);
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

    private removeOptionsComFromBody() {
        if (this.optionsComponentRef) {
            this.optionsComponentRef.destroy();
        }
    }

    private updateOptionsScreenLocation() {
        const styles = AwesomeHelper.getStylesPosition(this.container.nativeElement, '.a-typehead-multiple');
        this.optionsComponentRef.instance.style = styles;
    }

    private focusIntoInputControl() {
        setTimeout(() => {
            this.getInputControl().select();
        }, 1);
    }

    private getInputControl() {
        return this.container.nativeElement.querySelector('.typehead-input');
    }

    private getInputGroupButton() {
        return this.container.nativeElement.querySelector('.input-group-addon');
    }

    private selectInputControlText() {
        setTimeout(() => {
            this.getInputControl().select();
        }, 1);
    }

    private isValueUpdateRequired(options: AwesomeOption[]) {
        // TODO
        return true;
    }

    private filterOptions(text: string, options: AwesomeOption[]): AwesomeOption[] {
        if (this.debug) {
            console.log('filterOptions begin', text, options);
        }
        let filtered: AwesomeOption[] = [];
        if (!text || text === '') {
            // if there is no text supplied return unfiltered options
            filtered = options;
        } else if (false) {
            // if selected option text is the same as searched text return unfiltered options
            // return options;
        } else {
            // in all other conditions return filtered options
            filtered = options.filter((option) => {
                // filter by text contained in the option text
                return option.text.toLowerCase().includes(text.toLowerCase());
            });
        }
        // exclude selected options from filtered value
        filtered = filtered.filter((filteredOption: AwesomeOption) => {
            const foundInSelected = (this.selectedOptionsValue || []).filter((selectedOption: AwesomeOption) => {
                return filteredOption.compare(selectedOption);
            });
            return foundInSelected.length === 0;
        });
        if (this.debug) {
            console.log('filterOptions end', filtered);
        }
        return filtered;
    }

    private moveActiveFocus(position: number) {
        if (this.debug) {
            console.log('moveActiveFocus position', position);
        }
        let newPos = this.activeFocusPosition;
        if (newPos === undefined) {
            newPos = 0;
        } else {
            newPos += position;
        }
        if (this.optionsFiltered.length < newPos + 1) {
            newPos = 0;
        } else if (newPos < 0) {
            newPos = this.optionsFiltered.length - 1;
        }
        this.activeFocusPosition = newPos;
        if (this.debug) {
            console.log('moveActiveFocus newPos', newPos);
        }
    }

    private matchInputWithOption() {
        if (!this.typeHeadValue || this.typeHeadValue === '') {
            return;
        }
        if (this.optionsFiltered && this.optionsFiltered.length === 1) {
            this.optionWasSelected(this.optionsFiltered[0]);
        } else {
            // if the user has typed in different casing it will automatically match with an option
            const foundOption: AwesomeOption = this.optionsUnFiltered
                .find((a: AwesomeOption) =>
                    a.text.toLocaleLowerCase() === this.typeHeadValue.toLocaleLowerCase());
            if (foundOption) {
                this.optionWasSelected(foundOption);
            }
            this.typeHeadValue = '';
        }
    }
    // #endregion Internal functionality
}
