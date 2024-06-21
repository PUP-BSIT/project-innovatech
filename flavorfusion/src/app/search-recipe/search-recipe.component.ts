import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeResultService } from '../../services/recipe-result.service'; //added
import { Recipe } from '../../model/recipe';

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

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private recipeService: RecipeResultService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      this.mealType = params['mealType'] || '';
      this.dietaryPref = params['dietaryPref'] || '';
      this.ingredient = params['ingredient'] || '';
      this.searchRecipes(); 
    });
  }

  searchRecipes(): void {
    this.recipeService.searchRecipes(
      this.query, 
      this.mealType, 
      this.dietaryPref, 
      this.ingredient
    ).subscribe(
      (response: Recipe[]) => {
        this.searchResults = response;
      },
      error => {
        console.error('Error fetching recipes: ', error);
      }
    );
  }

  viewRecipeDetails(recipeId: number): void {
    if (recipeId !== undefined && recipeId !== null) {
      this.router.navigate(['/recipe-details', recipeId])
    } else {
      console.error('Invalid recipe ID:', recipeId);
    }
  }  
}
