import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {
  modalText: string = '';
  inputFields: any[] = []; 
  selectedCategories: {title: string, items: string[]}[] = [];
  showMealTypes: boolean = false;
  showDietaryPreferences: boolean = false;
  showIngredients: boolean = false;
  activeCategory: string = '';
  activeSubCategory: string = '';

  ngOnInit() {
    window.addEventListener('click', (event: Event) => {
      const modal = document.getElementById('my_modal') as HTMLElement;
      if (event.target === modal) {
        this.closeModal();
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

  addInputField() {
    this.inputFields.push('');
    event.preventDefault();
  }

  toggleCategory(category: string) {
    this.showMealTypes = category === 'MealTypes' ? !this.showMealTypes : false;
    this.showDietaryPreferences = category === 'DietaryPreferences' ? !this.showDietaryPreferences : false;
    this.showIngredients = category === 'Ingredients' ? !this.showIngredients : false;
  }

  addCategory(categoryType: string, category: string) {
    let categoryGroup = this.selectedCategories.find(group => group.title === categoryType);
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
    return this.activeCategory === category && this.activeSubCategory === subCategory;
  }
}
