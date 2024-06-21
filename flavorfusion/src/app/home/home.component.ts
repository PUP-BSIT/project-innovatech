import { Component } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    { name: 'Soup', image: 'assets/images/soup.jpg' }
  ];

  latestRecipes = [
    { name: 'Chocolate Cookie', image: 'assets/images/chocolate_cookie.jpg' },
    { name: 'Chicken Quesadillas', image: 'assets/images/chicken_quesadilla.jpg' },
    { name: 'Red Curry Pork', image: 'assets/images/red_curry.jpg' },
    { name: 'Flan', image: 'assets/images/flan.jpg' }
  ];

  filters = {
    eggs: false,
    dairy: false,
    nuts: false,
    fish: false,
    shrimp: false,
    vegetables: false
  };

  showDropdown: boolean = false;
  isFiltered: boolean = false;
  filteredRecipes = [];
  lastSelectedFilters: string[] = [];

  constructor(private homeService: HomeService, private snackBar: MatSnackBar) {}

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  hasSelectedFilter(): boolean {
    return Object.values(this.filters).some(value => value);
  }

  applyFilter(): void {
    const selectedFilters = Object.keys(this.filters).filter(key => this.filters[key]);
    this.lastSelectedFilters = selectedFilters; 
    console.log("Selected filters:", selectedFilters);
    if (selectedFilters.length) {
      this.homeService.getFilteredRecipes(selectedFilters).subscribe(
        (recipes) => {
          console.log("Filtered recipes:", recipes); 
          this.filteredRecipes = recipes;
          this.isFiltered = true;
          this.showDropdown = false;
        },
        (error) => {
          console.error('Error fetching filtered recipes', error);
          this.snackBar.open('Error fetching filtered recipes. Try again.', 'Try Again', {
            duration: 3000
          }).onAction().subscribe(() => {
            this.reapplyFilter();
          });
        }
      );
    }
  }

  reapplyFilter(): void {
    if (this.lastSelectedFilters.length) {
      this.homeService.getFilteredRecipes(this.lastSelectedFilters).subscribe(
        (recipes) => {
          console.log("Filtered recipes:", recipes);
          this.filteredRecipes = recipes;
          this.isFiltered = true;
          this.showDropdown = false;
        },
        (error) => {
          console.error('Error fetching filtered recipes', error);
          this.snackBar.open('Error fetching filtered recipes. Try again.', 'Try Again', {
            duration: 3000
          }).onAction().subscribe(() => {
            this.reapplyFilter();
          });
        }
      );
    }
  }
}