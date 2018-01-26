import { EventEmitter, OnInit, ElementRef } from '@angular/core';
import { AwesomeOption } from './../shared/awesome-option';
export declare class AwesomeOptionsComponent implements OnInit {
    optionsElement: ElementRef;
    options: AwesomeOption[];
    selectedOption: AwesomeOption;
    mainElement: ElementRef;
    debug: boolean;
    style: string;
    activeFocusPosition: number;
    helperButton: string;
    onOptionSelected: EventEmitter<AwesomeOption>;
    onMouseEnter: EventEmitter<any>;
    onHelperButtonClick: EventEmitter<any>;
    private _options;
    constructor(optionsElement: ElementRef);
    ngOnInit(): void;
    selectOption(option: AwesomeOption): void;
    isOptionSelected(option: AwesomeOption): boolean;
    onMouseEntered($event: any): void;
    onHelperButtonClickHandler($event: Event): void;
}
