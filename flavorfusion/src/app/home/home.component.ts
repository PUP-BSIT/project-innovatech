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
  editRecipe: any = {};

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
      this.loadFilterState();
    }
  }

  checkLoginStatus(): void {
    this.loginAuthService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.loadLatestRecipes();
        this.loadFilterState();
      }
    });
  }

  loadPopularRecipes(): void {
    this.homeService.getPopularRecipes().subscribe(
      (recipes) => {
        this.popularRecipes = recipes;
      },
      (error) => {
        this.snackBar.open(
          'Error fetching popular recipes. Try again.', 'Try Again', { 
            duration: 3000 
        });
      }
    );
  }

  loadLatestRecipes(): void {
    this.homeService.getUserRecipes().subscribe(
      (recipes) => {
        this.latestRecipes = recipes;
      },
      (error) => {
        console.error('Error fetching user recipes', error);
      }
    );
  }

  loadFilterState(): void {
    const savedFilters = localStorage.getItem('filters');
    const savedFilteredRecipes = localStorage.getItem('filteredRecipes');
    const savedIsFiltered = localStorage.getItem('isFiltered');

    if (savedFilters) {
      this.filters = JSON.parse(savedFilters);
    }

    if (savedFilteredRecipes) {
      this.filteredRecipes = JSON.parse(savedFilteredRecipes);
      this.isFiltered = JSON.parse(savedIsFiltered);
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  hasSelectedFilter(): boolean {
    return Object.values(this.filters).some(value => value);
  }

  applyFilter(): void {
    const selectedFilters = Object.keys(this.filters)
      .filter(key => this.filters[key]);
    this.lastSelectedFilters = selectedFilters;
    if (selectedFilters.length) {
      this.homeService.getFilteredRecipes(selectedFilters).subscribe(
        (recipes) => {
          this.filteredRecipes = recipes;
          this.isFiltered = true;
          this.showDropdown = false;
          localStorage.setItem('filters', JSON.stringify(this.filters));
          localStorage.setItem('filteredRecipes', JSON.stringify(this.filteredRecipes));
          localStorage.setItem('isFiltered', JSON.stringify(this.isFiltered));
        },
        (error) => {
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
          this.filteredRecipes = recipes;
          this.isFiltered = true;
          this.showDropdown = false;
        },
        (error) => {
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

  shareRecipe(): void {
    this.router.navigate(
      ['/profile'], 
      { queryParams: { showShareRecipe: true } }
    );
  }

  deleteRecipe(recipeId): void {
    this.homeService.deleteUserRecipe(recipeId).subscribe(
      (response) => {
        if (response.success) {
          this.latestRecipes = this.latestRecipes.filter(
            recipe => recipe.recipe_id !== recipeId
          );
          this.snackBar.open('Recipe deleted successfully!', 'Close', {
            duration: 3000
          });
        } else {
          this.snackBar.open(
            'Failed to delete recipe. Try again.', 'Try Again', {
              duration: 3000
          });
        }
      },
      (error) => {
        this.snackBar.open('Error deleting recipe. Try again.', 'Try Again', {
          duration: 3000
        });
      }
    );
  }

  getRecipeDetails(recipeId: number): void {
    this.homeService.getRecipeDetails(recipeId).subscribe(
      (recipe) => {
        this.editRecipe = {
          ...recipe,
          meal_type: recipe.meal_types ? recipe.meal_types.split(',')[0] : '',
          dietary_preference: recipe.dietary_prefs 
            ? recipe.dietary_prefs.split(',')[0] 
            : '',
        };
        this.showModal = true;
      },
      (error) => {
        this.snackBar.open(
          'Error fetching recipe details. Try again.', 'Try Again', {
            duration: 3000
        });
      }
    );
  }

  updateRecipe(): void {
    this.homeService.updateRecipe(this.editRecipe).subscribe(
      (response) => {
        if (response.success) {
          this.snackBar.open('Recipe updated successfully!', 'Close', {
            duration: 3000
          });
          this.showModal = false;
          this.loadLatestRecipes();
        } else {
          this.snackBar.open(
            'Failed to update recipe. Try again.', 'Try Again', {
              duration: 3000
          });
        }
      },
      (error) => {
        this.snackBar.open('Error updating recipe. Try again.', 'Try Again', {
          duration: 3000
        });
      }
    );
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.editRecipe.picture = (reader.result as string).split(',')[1];
    };
    reader.readAsDataURL(file);
    this.editRecipe.pictureFile = file;
  }

  logout(): void {
    this.loginAuthService.logout().subscribe(() => {
      localStorage.removeItem('filters');
      localStorage.removeItem('filteredRecipes');
      localStorage.removeItem('isFiltered');
      this.isLoggedIn = false;
      this.router.navigate(['/']);
    }, error => {
      console.error('Error during logout', error);
      this.snackBar.open('Error during logout. Please try again.', 'Close', {
        duration: 3000
      });
    });
  }
}