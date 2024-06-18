import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit{
  modalText: string = '';
  inputFields: any[] = []; 
  selectedCategories: { title: string, items: string[] }[] = [];
  showMealTypes: boolean = false;
  showDietaryPreferences: boolean = false;
  showIngredients: boolean = false;
  activeCategory: string = '';
  activeSubCategory: string = '';
  searchResults: any[] = [];
  query: string = '';

  constructor(
    private route: ActivatedRoute, 
    private searchService: SearchService, 
    private router: Router) {}

  ngOnInit(): void{
    window.addEventListener('click', (event: Event) => {
      const modal = document.getElementById('my_modal') as HTMLElement;
      if (event.target === modal) {
        this.closeModal();
      }
    });

    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      if (this.query) {
        this.searchService.searchRecipes(this.query).subscribe(results => {
          this.searchResults = results;
        });
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

  searchRecipes() {
    console.log('Searching recipes...');
  }

  onSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.query) {
      this.router.navigate(['/search-recipe'], { queryParams: { query: this.query } });
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
  }

  setActiveCategory(category: string, subCategory: string) {
    this.activeCategory = category;
    this.activeSubCategory = subCategory;
  }

  isCategoryActive(category: string, subCategory: string): boolean {
    return this.activeCategory === category &&
      this.activeSubCategory === subCategory;
  }
}