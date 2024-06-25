import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeResultService } from '../../services/recipe-result.service';
import { UserService } from '../../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;
  saved: boolean = false; 
  user: any;

  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeResultService,
    private userService: UserService,
    private snackBar: MatSnackBar
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
        this.checkSavedStatus(); 
      },
      error => {
        console.error('Error fetching user profile: ', error);
      }
    );
  }


  toggleSave(): void {
    if (this.user) {
      const userId = this.user.user_id;
      const recipeId = this.recipe.recipe_id;

      console.log('User ID:', userId);
      console.log('Recipe ID', recipeId);

      if (this.saved) {
        this.recipeService.unsaveRecipe(userId, recipeId).subscribe(
          response => {
            if (response.success) {
              this.saved = false;
              this.snackBar.open('Recipe unsaved successfully!.',
                'Close', {
               duration: 3000,
           });
            } else {
              this.snackBar.open('Unfailed unsaving recipe. Please try again',
                'Close', {
               duration: 3000,
           });
            }
          },
          error => {
            console.error('Error unsaving recipe:', error);
            alert(`Failed to unsave recipe. Error: ${error.message}`);
          }
        );
      } else {
        this.recipeService.saveRecipe(userId, recipeId).subscribe(
          response => {
            if (response.success) {
              this.saved = true;
              this.snackBar.open('Recipe Saved Successfully',
                'Close', {
               duration: 3000,
           });
            } else {
              this.snackBar.open('Failed to save recipe. Please try again.',
                'Close', {
               duration: 3000,
           });
            }
          },
          error => {
            console.error('Error saving recipe:', error);
          }
        );
      }
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
}