import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeResultService } from '../../services/recipe-result.service';
import { UserService } from '../../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginAuthentication } from '../../services/login-authentication.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;
  saved: boolean = false; 
  user: any;
  isRateModalOpen: boolean = false; 
  rating: number = 0;
  stars: boolean[] = [false, false, false, false, false];

  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeResultService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: LoginAuthentication // Inject the service
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const recipeId = +params['id'];
      this.fetchRecipeDetails(recipeId);
    });

    this.fetchUserProfile();
  }  

  fetchRecipeDetails(recipeId: number): void {
    this.recipeService.getRecipeDetails(recipeId).subscribe(
      response => {
        this.recipe = response;
        this.checkSavedStatus(); 
      },
      error => {
        console.error('Error fetching recipe details: ', error);
      }
    );
  }

  fetchUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      response => {
       this.user = response;
        this.checkSavedStatus(); // Ensure saved status check after user fetch
      },
      error => {
        console.error('Error fetching user profile: ', error);
      }
    );
  }

  toggleSave(): void {
    if (this.authService.isLoggedIn()) { // Check if user is logged in
      const userId = this.user.user_id;
      const recipeId = this.recipe.recipe_id;

      if (this.saved) {
        this.recipeService.unsaveRecipe(userId, recipeId).subscribe(
          response => {
            if (response.success) {
              this.saved = false;
              this.snackBar.open('Recipe unsaved successfully!', 
                'Close', { duration: 3000 });
            } else {
              this.snackBar.open('Failed to unsave recipe. Please try again', 
                'Close', { duration: 3000 });
            }
          },
          error => {
            console.error('Error unsaving recipe:', error);
            this.snackBar.open(`Failed to unsave recipe.
               Error: ${error.message}`, 'Close', { duration: 3000 });
          }
        );
      } else {
        this.recipeService.saveRecipe(userId, recipeId).subscribe(
          response => {
            if (response.success) {
              this.saved = true;
              this.snackBar.open('Recipe saved successfully!', 
                'Close', { duration: 3000 });
            } else {
              this.snackBar.open('Failed to save recipe. Please try again.', 
                'Close', { duration: 3000 });
            }
          },
          error => {
            console.error('Error saving recipe:', error);
            this.snackBar.open(`Failed to save recipe. Error: ${error.message}`, 
              'Close', { duration: 3000 });
          }
        );
      }
    } else {
      this.snackBar.open('You must be logged in to save recipes.', 
        'Close', { duration: 3000 });
    }
  }

  checkSavedStatus(): void {
    if (this.user && this.recipe) {
      const userId = this.user.user_id;
      const recipeId = this.recipe.recipe_id;
  
      this.recipeService.checkIfRecipeSaved(userId, recipeId).subscribe(
        isSaved => {
          this.saved = isSaved;
        },
        error => {
          console.error('Error checking saved status: ', error);
        }
      );
    }
  }

  openRateModal(): void {
    if (this.authService.isLoggedIn()) {
      this.isRateModalOpen = true;
    } else {
      this.snackBar.open('You must be logged in to rate recipes.', 
        'Close', { duration: 3000 });
    }
  }

  closeRateModal(): void {
    this.isRateModalOpen = false;
  }

  setRating(rating: number):void {
    this.rating = rating;
    this.stars = this.stars.map((_, i) => i < rating);
  }
  
  submitRating(): void {
    if (this.user && this.recipe) {
      const userId = this.user.user_id;
      const recipeId = this.recipe.recipe_id;
  
      this.recipeService.submitRating(recipeId, userId, this.rating).subscribe(
        response => {
          if (response.success) {
            this.snackBar.open(
              'Rating submitted successfully!', 
              'Close', 
              { duration: 3000 }
            );
          } else {
            this.snackBar.open(
              'Failed to submit rating. Please try again.', 
              'Close', 
              { duration: 3000 }
            );
          }
        },
        error => {
          console.error('Error submitting rating:', error);
          this.snackBar.open(
            'Failed to submit rating. Please try again.', 
            'Close', 
            { duration: 3000 });
        }
      );
  
      this.closeRateModal();
    } else {
      this.snackBar.open(
        'You must be logged in to rate recipes.', 
        'Close', 
        { duration: 3000 }
      );
    }
  }
}