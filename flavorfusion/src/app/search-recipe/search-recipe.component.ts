import { Component } from '@angular/core';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrl: './search-recipe.component.css'
})
export class SearchRecipeComponent {
  cakes = [
    { 
        name: 'Triple Chocolate Cake', 
        image: 'assets/images/triple-chocolate-cake.jpg', 
        rating: 5 
    },
    { 
        name: 'Strawberry Cake', 
        image: 'assets/images/strawberry-cake.jpg', 
        rating: 4 
    },
    { 
        name: 'Red Velvet Cake', 
        image: 'assets/images/red-velvet-cake.jpg', 
        rating: 5 
    },
    { 
        name: 'Blueberry Cake', 
        image: 'assets/images/blueberry-cake.jpg', 
        rating: 5 
    },
    { 
        name: 'Tiramisu Cake', 
        image: 'assets/images/tiramisu-cake.jpg', 
        rating: 5 
    },
    { 
        name: 'Vanilla Sponge Cake', 
        image: 'assets/images/vanilla-sponge-cake.jpg', 
        rating: 4 
    },
    { 
        name: 'Caramello Cake', 
        image: 'assets/images/caramello-cake.jpg', 
        rating: 4 
    },
    { 
        name: 'Black Forest Cake', 
        image: 'assets/images/black-forest-cake.jpg', 
        rating: 5 
    }
  ];
}
