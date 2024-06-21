import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeResultService } from '../../services/recipe-result.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;

  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeResultService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const recipeId = +params['id'];
      this.fetchRecipeDetails(recipeId);
    });
  }  

  fetchRecipeDetails(recipeId: number): void {
    this.recipeService.getRecipeDetails(recipeId).subscribe(
      response => {
        this.recipe = response;
      },
      error => {
        console.error('Error fetching recipe details: ', error);
      }
    );
  }
}