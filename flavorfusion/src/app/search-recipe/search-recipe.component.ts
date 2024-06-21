import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.css']
})
export class SearchRecipeComponent implements OnInit {
  searchResults: any[] = [];
  query: string = '';
  mealType: string = '';
  dietaryPref: string = '';
  ingredient: string = '';

  constructor(
    private route: ActivatedRoute, 
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      this.mealType = params['mealType'] || '';
      this.dietaryPref = params['dietaryPref'] || '';
      this.ingredient = params['ingredient'] || '';

      if (this.query || this.mealType || this.dietaryPref || this.ingredient) {
        this.searchRecipes();
      }
    });
  }

  searchRecipes(): void {
    this.searchService.searchRecipes(this.query, this.mealType, this.dietaryPref, this.ingredient).subscribe(
      response => {
        this.searchResults = response || [];
      },
      error => {
        console.error('Error fetching recipes: ', error);
      }
    );
  }
}
