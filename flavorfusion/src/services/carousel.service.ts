import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  // TODO(Asebuque, Chrystine Noelle): 
  // Replace this mock data with a real HTTP request to the backend
  private slides = [
    {
      meal: 'BREAKFAST',
      title: 'Pancakes with Maple Syrup',
      description: 'Fluffy pancakes served with a generous drizzle of pure '
                  + 'maple syrup and a side of fresh berries.',
      time: '20m',
      perPerson: '2 persons',
      image: 'assets/images/pancakes.jpg'
    },
    {
      meal: 'LUNCH',
      title: 'Caramelised Chicken',
      description: 'Sticky caramel sauce and oodles of noodles make this easy '
                  + 'chicken stir-fry the whole family will enjoy.',
      time: '40m',
      perPerson: '3 persons',
      image: 'assets/images/caramelised_chicken.jpg'
    },
    {
      meal: 'DINNER',
      title: 'Grilled Salmon',
      description: 'Succulent grilled salmon served with lemon butter sauce.',
      time: '30m',
      perPerson: '4 persons',
      image: 'assets/images/grilled_salmon.jpg'
    }
  ];

  constructor() { }

  getSlides(): Observable<any[]> {
    // TODO(Asebuque, Chrystine Noelle): 
    // Replace this mock implementation with a real API call.
    return of(this.slides);
  }
}