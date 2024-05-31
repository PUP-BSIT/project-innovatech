import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  categories = [
    { name: 'Pasta', image: 'assets/images/pasta.jpg' },
    { name: 'Chicken', image: 'assets/images/chicken.jpg' },
    { name: 'Vegetable', image: 'assets/images/vegetable.jpg' },
    { name: 'Soup', image: 'assets/images/soup.jpg' },
  ];

  latestRecipes = [
    { name: 'Chocolate Cookie', image: 'assets/images/chocolate_cookie.jpg' },
    { name: 'Chicken Quesadillas', image: 'assets/images/chicken_quesadilla.jpg' },
    { name: 'Red Curry Pork', image: 'assets/images/red_curry.jpg' },
    { name: 'Red Curry Pork', image: 'assets/images/flan.jpg' }
  ];

  showDropdown: boolean = false;

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
}