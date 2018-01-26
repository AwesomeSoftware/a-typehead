import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AwesomeTypeheadModule } from './a-typehead/awesome-typehead.module';

import { AppComponent } from './app.component';


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
