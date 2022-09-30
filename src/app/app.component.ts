import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'luis ramirez';
  imgURL = 'https://picsum.photos/id/237/500/500';
  currentDate = new Date();
  cost = 2000;
  temperature = 25.22;
  pizza = {toppings: ['pepperoni', 'bacon'], size: 'large'}

  getTitle () {
    return `this is angular ${this.title}`;
  }

  changeImage(event: KeyboardEvent ) {
    this.imgURL = (event.target as HTMLInputElement).value;
  }

  logImg(event: string) {
    console.log(event);
  }
}
