import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  state = new FormControl();
  states = [
    {
      'id': 1,
      'text': 'Australia'
    },
    {
      'id': 2,
      'text': 'Germany'
    },
    {
      'id': 3,
      'text': 'Norway'
    }
  ];
  city = new FormControl();
  cities = [
    {
      'id': 1,
      'text': 'Sydney'
    },
    {
      'id': 2,
      'text': 'Melbourne'
    },
    {
      'id': 3,
      'text': 'Berlin'
    },
    {
      'id': 4,
      'text': 'Munich'
    },
    {
      'id': 5,
      'text': 'Oslo'
    },
    {
      'id': 6,
      'text': 'Bergen'
    }

  ];
}
