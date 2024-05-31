import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  slides = [
    {
      meal: 'BREAKFAST',
      title: 'Pancakes with Maple Syrup',
      description: 'Fluffy pancakes served with a generous drizzle of pure maple syrup and a side of fresh berries.',
      time: '20m',
      perPerson: '2 persons',
      image: 'assets/images/pancakes.jpg'
    },
    {
      meal: 'LUNCH',
      title: 'Caramelised Chicken',
      description: 'Sticky caramel sauce and oodles of noodles make this easy chicken stir-fry the whole family will enjoy.',
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

  currentSlide = 0;

  constructor() { }

  ngOnInit(): void {
    this.showSlide(this.currentSlide);
  }

  setSlide(index: number): void {
    this.currentSlide = index;
    this.showSlide(this.currentSlide);
  }

  showSlide(index: number): void {
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');

    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.remove('active');
      if (i === index) {
        dot.classList.add('active');
      }
    });

    const carouselInner = document.querySelector('.carousel-inner') as HTMLElement;
    carouselInner.style.transform = `translateX(-${index * 100}%)`;
  }
}