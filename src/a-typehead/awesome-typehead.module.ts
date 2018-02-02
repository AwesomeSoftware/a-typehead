import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AwesomeTypeheadComponent } from './awesome-typehead/awesome-typehead.component';
import { AwesomeTypeheadMultipleComponent } from './awesome-typehead-multiple/awesome-typehead-multiple.component';
import { AwesomeOptionsComponent } from './awesome-options/awesome-options.component';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@NgModule({
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
    providers: [
    ],
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
})
export class AwesomeTypeheadModule { }
