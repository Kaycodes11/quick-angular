import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>This is app component</h2>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  ngOnInit() {
    console.log('initial render');
  }
}
