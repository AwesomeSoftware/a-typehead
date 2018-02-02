import { Component, Input, OnInit, ElementRef, forwardRef, ComponentFactoryResolver,
    ViewContainerRef, ComponentRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { AwesomeOptionsComponent } from '../awesome-options/awesome-options.component';
import { AwesomeOption } from './../shared/awesome-option';
import { AwesomeHelper } from './../shared/awesome-helper';

const noop = () => {};

@Component({
    selector: 'a-typehead',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AwesomeTypeheadComponent),
        multi: true
    }],
    templateUrl: './awesome-typehead.component.html',
    styleUrls: ['./awesome-typehead.component.scss']
})

export class AwesomeTypeheadComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() public formControl: FormControl = new FormControl();
    @Input() public idField = 'id';
    @Input() public textField = 'text';
    @Input() public id = Math.random();
    @Input() public debug = false;
    @Input() public set options(options: any[]) {
        this.optionsRaw = options;
        this.setOptions(options);
    }
    @Input() public set selectedOption(option: any) {
        this.setSelectedOption(option);
    }
    @Input() public set optionsOpened(val: boolean) {
        this._optionsOpened = val;
    }
    @Input() public filterOnBackend = false;
    @Input() public filterDelayMs = 150;
    @Input() public helperButton = 'test';

    @Output() public onHelperButtonClick = new EventEmitter<any>();
    @Output() public onOptionSelected = new EventEmitter<any>();

    public get selectedOption(): any {
        return this._selectedOption;
    }
    public get optionsOpened(): boolean {
        return this._optionsOpened;
    }

    private _selectedOption: AwesomeOption;
    private optionsRaw: any[] = [];
    private optionsUnFiltered: AwesomeOption[] = [];
    private optionsFiltered: AwesomeOption[] = [];
    private _optionsOpened = false;
    private typeHeadValue: string;
    private optionsComponentRef: ComponentRef<AwesomeOptionsComponent>;
    private optionsFilterTerms = new Subject<string>();
    private optionsFilterObservable: Observable<AwesomeOption[]>;
    private activeFocusPosition: number;
    private isDisabled = false;

    private onChange: (_: any) => void = noop;
    private onTouched: () => void = noop;

    private onWindowScrollOrResizeDelegate: any = this.onWindowScrollOrResize.bind(this);
    private onBodyClickDelegate: any = this.onBodyClick.bind(this);

    constructor(public container: ElementRef,
        public optionsElement: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef) {}

    ngOnInit() {
        if (this.filterOnBackend) {
            // TODO develop filtering on backend
            // it should execute the routine for requesting data
            // and show the spinner while this is loading
        } else {
            // run the filter search with debounce time configured in the component
            this.optionsFilterObservable = this.optionsFilterTerms
                .debounceTime(this.filterDelayMs)
                .distinctUntilChanged()
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

    // regionstart asd
    // ControlValueAccessor interface implementation
    writeValue(val: any): void {
        if (this.isValueUpdateRequired(val)) {
            this.setSelectedOption(val, false);
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
    // regionend asd

    toggleOptions() {
        if (this._optionsOpened === true) {
            this.closeOptions();
        } else {
            this.optionsFilterTerms.next(this.typeHeadValue);
            this.openOptions();
            this.focusIntoInputControl();
        }
    }

    openOptions() {
        this._optionsOpened = true;
        this.appendOptionsCompToBody();
        this.bindEvents();
    }

    closeOptions() {
        this.removeOptionsComFromBody();
        this._optionsOpened = false;
        this.activeFocusPosition = undefined;
        this.unBindEvents();
    }

    focusIntoInputControl() {
        setTimeout(() => {
            this.getInputControl().select();
        }, 1);
    }

    selectInputControlText() {
        setTimeout(() => {
            this.getInputControl().select();
        }, 1);
    }


    optionWasSelected(option: AwesomeOption) {
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

    onInputKeyPressed($event: KeyboardEvent) {
        switch ($event.keyCode) {
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            case 38: // up arrow
            case 40: // down arrow
                $event.preventDefault();
                // open options dropdown if it was closed
                if (!this.optionsOpened) {
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
                if (this.optionsOpened) {
                    this.closeOptions();
                }
                // revert the text back to the previous value
                if (this.selectedOption) {
                    if (this.selectedOption.text !== this.typeHeadValue) {
                        this.typeHeadValue = this.selectedOption.text;
                    }
                } else {
                    // reset the typehead text if there was no option selected before
                    this.typeHeadValue = '';
                }
                // focus into typehead
                this.focusIntoInputControl();
                break;
            case 13: // enter
                $event.preventDefault();
                if (this.activeFocusPosition !== undefined) {
                    const selectedOption = this.optionsFiltered[this.activeFocusPosition];
                    this.setSelectedOption(selectedOption);
                    this.activeFocusPosition = undefined;
                    this.closeOptions();
                    this.focusIntoInputControl();
                } else {
                    if (this.typeHeadValue === '') {
                        this.setSelectedOption(null);
                        this.closeOptions();
                    } else {
                        this.matchInputWithOption();
                        this.closeOptions();
                        this.focusIntoInputControl();
                    }
                }
                break;
        }
    }

    onOptionsMouseEntered($event) {
    }

    onInputGroupMouseEntered($event) {
    }

    onWindowScrollOrResize() {
        this.updateOptionsScreenLocation();
    }

    onBodyClick($event) {
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


    private appendOptionsCompToBody() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(AwesomeOptionsComponent);
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

    private removeOptionsComFromBody() {
        if (this.optionsComponentRef) {
            this.optionsComponentRef.destroy();
        }
    }

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

    private setSelectedOption(option: any, updateFormControl = true) {
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
        } else {
            if (typeof option === 'object') {
                const awesomeOption = new AwesomeOption(this.textField, this.idField, option);
                this.updateSelectedOptionValue(awesomeOption, awesomeOption.text, updateFormControl);
            } else {
                const awesomeOption = new AwesomeOption(null, null, null, option);
                this.updateSelectedOptionValue(awesomeOption.text, awesomeOption.text, updateFormControl);
            }
        }
    }

    private updateSelectedOptionValue(objValue: any, textValue: string, updateFormControl = true) {
        if (this.debug) {
            console.log('updateSelectedOptionValue', objValue, textValue, updateFormControl);
        }
        this._selectedOption = objValue;
        this.typeHeadValue = textValue;
        if (updateFormControl) {
            if (objValue instanceof AwesomeOption) {
                this.formControl.setValue(objValue.model);
                this.onChange(objValue.model);
            } else {
                this.formControl.setValue(objValue);
                this.onChange(objValue);
            }
        }
    }

    private matchInputWithOption() {
        if (!this.typeHeadValue) {
            this.selectedOption = null;
            return;
        }
        if (this.optionsFiltered && this.optionsFiltered.length === 1) {
            this.selectedOption = this.optionsFiltered[0];
            this.typeHeadValue = this.optionsFiltered[0].text;
            this.onOptionSelected.emit(this.selectedOption.model);
        } else {
            // if the user has typed in different casing it will automatically match with an option
            const foundOption: AwesomeOption = this.optionsUnFiltered
                .find((a: AwesomeOption) =>
                    a.text.toLocaleLowerCase() === this.typeHeadValue.toLocaleLowerCase());
            if (foundOption) {
                this.selectedOption = foundOption;
                this.typeHeadValue = foundOption.text;
                this.onOptionSelected.emit(foundOption.model);
            } else {
                // reset the value if the user hasn't selected anything
                this.typeHeadValue = null;
                this.selectedOption = null;
            }
        }
    }

    private updateOptionsScreenLocation() {
        const clientRect = this.container.nativeElement
            .querySelector('.a-typehead')
            .getBoundingClientRect();
        const width = clientRect.width;
        const height = clientRect.height;
        const leftOffset = clientRect.left;
        const topOffset = clientRect.top + height + window.pageYOffset;

        this.optionsComponentRef.instance.style =
            `position: absolute;
            width: ${width}px;
            left: ${leftOffset}px;
            top: ${topOffset}px;
            z-index: 10000`;
    }

    private getInputControl() {
        return this.container.nativeElement.querySelector('.form-control');
    }

    private getInputGroupButton() {
        return this.container.nativeElement.querySelector('.input-group-addon');
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

    private isValueUpdateRequired(option) {
        return ((this._selectedOption && !this._selectedOption.compare(option))
            || (!this._selectedOption && option));
    }

    private filterOptions(text: string, options: AwesomeOption[]): AwesomeOption[] {
        if (this.debug) {
            console.log('filterOptions', options);
        }
        if (!text || text === '') {
            // if there is no text supplied return unfiltered options
            return options;
        } else if (this.selectedOption && (<AwesomeOption>this.selectedOption).text.toLowerCase() === text.toLowerCase()) {
            // if selected option text is the same as searched text return unfiltered options
            return options;
        } else {
            // in all other conditions return filtered options
            return options.filter((option) => {
                // filter by text contained in the option text
                return option.text.toLowerCase().includes(text.toLowerCase());
            });
        }
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
}
