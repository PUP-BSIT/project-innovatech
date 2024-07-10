import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Recipe } from '../../model/recipe';  

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  modalText: string = '';
  inputFields: string[] = [''];
  selectedCategories: { title: string, items: string[] }[] = [];
  showMealTypes: boolean = false;
  showDietaryPreferences: boolean = false;
  showIngredients: boolean = false;
  activeCategory: string = '';
  activeSubCategory: string = '';
  query: string = '';
  mealType: string = '';
  dietaryPref: string = '';
  ingredient: string = '';
  isLoading: boolean = false;
  searchResults: Recipe[] = [];  

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.addEventListener('click', (event: Event) => {
      const modal = document.getElementById('my_modal') as HTMLElement;
      if (event.target === modal) {
        this.closeModal();
      }
    });

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

  openModal(category: string) {
    this.modalText = `Selected Category: ${category}`;
    const modal = document.getElementById('my_modal') as HTMLElement;
    modal.style.display = 'block';
  }

  closeModal() {
    const modal = document.getElementById('my_modal') as HTMLElement;
    modal.style.display = 'none';
  }

  openIngredientModal() {
    this.modalText = 'Share the ingredients that you have:';
    const modal = document.getElementById('my_modal') as HTMLElement;
    modal.style.display = 'block';
  }

  searchRecipes(): void {
    this.isLoading = true;
    this.searchService.searchRecipes(
      this.query, this.mealType, this.dietaryPref, this.ingredient)
      .subscribe((results: Recipe[]) => {
        this.searchResults = results;
        this.isLoading = false;
      });
    this.router.navigate(['/search-recipe'], {
      queryParams: {
        query: this.query,
        mealType: this.mealType,
        dietaryPref: this.dietaryPref,
        ingredient: this.ingredient
      }
    });
  }

  searchByIngredients(): void {
    this.ingredient = this.inputFields
      .filter(field => field.trim() !== '')
      .join(',');
    this.router.navigate(['/search-recipe'], {
      queryParams: {
        ingredient: this.ingredient
      }
    });
    this.closeModal();
  }  

  onSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.query) {
      this.router.navigate(['/search-recipe'], {
        queryParams: {
          query: this.query,
          mealType: this.mealType,
          dietaryPref: this.dietaryPref,
          ingredient: this.ingredient
        }
      });
    }
  }

  addInputField(event: Event) {
    event.preventDefault();
    this.inputFields.push('');
  }

  removeInputField(index: number) {
    this.inputFields.splice(index, 1);
  }

  toggleCategory(category: string) {
    this.showMealTypes = category === 'MealTypes'
      ? !this.showMealTypes
      : false;

    this.showDietaryPreferences = category === 'DietaryPreferences'
      ? !this.showDietaryPreferences
      : false;

    this.showIngredients = category === 'Ingredients'
      ? !this.showIngredients
      : false;
  }

  addCategory(categoryType: string, category: string) {
    let categoryGroup = this.selectedCategories.find(
      group => group.title === categoryType
    );

    if (!categoryGroup) {
      categoryGroup = { title: categoryType, items: [] };
      this.selectedCategories.push(categoryGroup);
    }

    if (!categoryGroup.items.includes(category)) {
      categoryGroup.items.push(category);
    }

    if (categoryType === 'Meal Type') {
      this.mealType = category.toLowerCase();
    } else if (categoryType === 'Dietary Preferences') {
      this.dietaryPref = category.toLowerCase();
    }

    this.searchRecipes();
  }

  setActiveCategory(category: string, subCategory: string) {
    this.activeCategory = category;
    this.activeSubCategory = subCategory;

    if (category === 'Meal Type') {
      this.mealType = subCategory.toLowerCase();
    }

    this.searchRecipes();
  }

  isCategoryActive(category: string, subCategory: string): boolean {
    return this.activeCategory === category &&
           this.activeSubCategory === subCategory;
  }

  trackByFn(index: number, item: any): number {
    return index;
  }
}
