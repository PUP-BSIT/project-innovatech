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

  constructor(
    private route: ActivatedRoute, 
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      if (this.query) {
        this.searchRecipes();
      }
    });
  }

  searchRecipes(): void {
    this.searchService.searchRecipes(this.query).subscribe(response => {
        this.searchResults = response.result || [];
      });
  }
}