import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Recipe } from '../../model/recipe'; 
import { RecipeRatingService } from '../../services/recipe-rating.service';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.css']
})
export class SearchRecipeComponent implements OnInit {
  searchResults: Recipe[] = [];
  query: string = '';
  mealType: string = '';
  dietaryPref: string = '';
  ingredient: string = '';
  dynamicHeading: string = '';

  constructor(
    private route: ActivatedRoute, 
    private searchService: SearchService, 
    private router: Router,
    private recipeRatingService: RecipeRatingService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      this.mealType = params['mealType'] || '';
      this.dietaryPref = params['dietaryPref'] || '';
      this.ingredient = params['ingredient'] || '';

      this.setDynamicHeading();
      
      if (this.query || this.mealType || this.dietaryPref || this.ingredient) {
        this.searchRecipes();
      }
    });
  }

  setDynamicHeading(): void {
    if (this.mealType) {
      this.dynamicHeading = `${this.capitalize(this.mealType)} Recipes`;
    } else if (this.dietaryPref) {
      this.dynamicHeading = `${this.capitalize(this.dietaryPref)} Recipes`;
    }
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  searchRecipes(): void {
    this.searchService.searchRecipes(
      this.query, this.mealType, this.dietaryPref, this.ingredient
    ).subscribe(
      (results: Recipe[]) => {
        this.searchResults = results || [];
        this.searchResults.forEach(result => this.fetchAverageRating(result));
      },
      error => {
        console.error('Error fetching recipes: ', error);
      }
    );
  }

  fetchAverageRating(recipe: Recipe): void {
    this.recipeRatingService.getAverageRating(recipe.recipe_id).subscribe(
      (data: { averageRating: number, ratingCount: number }) => {
        recipe.averageRating = data.averageRating;
        recipe.ratingCount = data.ratingCount;
      },
      error => {
        console.error('Error fetching average rating and count: ', error);
        recipe.averageRating = 0;
        recipe.ratingCount = 0;
      }
    );
  }

  viewRecipeDetails(recipeId: number): void {
    if (recipeId !== undefined && recipeId !== null) {
      this.router.navigate(['/recipe-details', recipeId]);
    } else {
      console.error('Invalid recipe ID:', recipeId);
    }
  }  
}
