import { Component, Input, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { AwesomeOption } from './../shared/awesome-option';

@Component({
    selector: 'a-options',
    templateUrl: './awesome-options.component.html',
    styleUrls: ['./awesome-options.component.scss']
})
export class AwesomeOptionsComponent implements OnInit {
    @Input() public set options(val: AwesomeOption[]) {
        this._options = val;
    }
    @Input() public selectedOption: AwesomeOption;
    @Input() public mainElement: ElementRef;
    @Input() public debug = false;
    @Input() public set style(style: string) {
        this.optionsElement.nativeElement.setAttribute('style', style);
    }
    @Input() public activeFocusPosition: number;
    @Input() public helperButton = 'test';

    @Output() public onOptionSelected = new EventEmitter<AwesomeOption>();
    @Output() public onMouseEnter = new EventEmitter<any>();
    @Output() public onHelperButtonClick = new EventEmitter<any>();

    public get options(): AwesomeOption[] {
        return this._options;
    }

    private _options: AwesomeOption[];

    constructor(public optionsElement: ElementRef) {}

    ngOnInit() {
    }

    selectOption(option: AwesomeOption) {
        this.onOptionSelected.emit(option);
    }

    isOptionSelected(option: AwesomeOption): boolean {
        if (!this.selectedOption) {
            return false;
        }
        if (typeof option === 'object') {
            return option.text === this.selectedOption.text;
        } else {
            return option === this.selectedOption;
        }
    }

    onMouseEntered($event) {
        this.onMouseEnter.emit($event);
    }

    onHelperButtonClickHandler($event: Event) {
        this.onHelperButtonClick.emit($event);
    }
}
