import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'
import { AwesomeTypeheadModule } from '../../../src/awesome-typehead.module';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AwesomeTypeheadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
