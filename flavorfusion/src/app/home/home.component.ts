import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { LoginAuthentication } from '../../services/login-authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  popularRecipes = [];
  latestRecipes = [];
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
  isLoggedIn: boolean = false;
  showModal: boolean = false;

  constructor(
    private homeService: HomeService,
    private snackBar: MatSnackBar,
    private loginAuthService: LoginAuthentication,
    private router: Router
  ) {
    this.isLoggedIn = !!localStorage.getItem('isLoggedIn');
  }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadPopularRecipes();
    if (this.isLoggedIn) {
      this.loadLatestRecipes();
    }
  }

  checkLoginStatus(): void {
    this.loginAuthService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.loadLatestRecipes();
      }
    });
  }

  loadPopularRecipes(): void {
    this.homeService.getPopularRecipes().subscribe(
      (recipes) => {
        console.log('Popular recipes:', recipes);
        this.popularRecipes = recipes;
      },
      (error) => {
        console.error('Error fetching popular recipes', error);
        this.snackBar.open('Error fetching popular recipes. Try again.', 'Try Again', {
          duration: 3000
        });
      }
    );
  }

  loadLatestRecipes(): void {
    this.homeService.getUserRecipes().subscribe(
      (recipes) => {
        console.log('User recipes:', recipes);
        this.latestRecipes = recipes;
      },
      (error) => {
        console.error('Error fetching user recipes', error);
      }
    );
  }

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
          this.snackBar.open(
            'Error fetching filtered recipes. Try again.', 'Try Again', {
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
          this.snackBar.open(
            'Error fetching filtered recipes. Try again.', 'Try Again', {
            duration: 3000
          }).onAction().subscribe(() => {
            this.reapplyFilter();
          });
        }
      );
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile'], { queryParams: { openShareRecipe: true } });
  }

  deleteRecipe(recipeId): void {
    console.log('Attempting to delete recipe with ID:', recipeId);
    this.homeService.deleteUserRecipe(recipeId).subscribe(
      (response) => {
        if (response.success) {
          this.latestRecipes = this.latestRecipes.filter(recipe => recipe.recipe_id !== recipeId);
          this.snackBar.open('Recipe deleted successfully!', 'Close', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to delete recipe. Try again.', 'Try Again', {
            duration: 3000
          });
          console.error('Error response from server:', response.error);
        }
      },
      (error) => {
        console.error('Error deleting recipe', error);
        this.snackBar.open('Error deleting recipe. Try again.', 'Try Again', {
          duration: 3000
        });
      }
    );
  }
}