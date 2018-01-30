import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AwesomeTypeheadModule } from 'awesome-typehead';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AwesomeTypeheadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
