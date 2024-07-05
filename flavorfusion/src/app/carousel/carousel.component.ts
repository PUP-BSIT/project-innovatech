import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  slides = [];
  currentSlide = 0;
  slideInterval: any;

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.fetchDailyMeals();

    setInterval(() => {
      this.fetchDailyMeals();
    }, 86400000);

    this.startSlideInterval();
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
  }

  fetchDailyMeals(): void {
    const storedMeals = localStorage.getItem('dailyMeals');
    const storedDate = localStorage.getItem('mealsDate');
    const today = new Date().toLocaleDateString();
    if (storedMeals && storedDate === today) {
      this.slides = JSON.parse(storedMeals);
      this.showSlide(this.currentSlide);
    } else {
      this.homeService.getDailyMeals().subscribe(data => {
        this.slides = [
          { meal: 'BREAKFAST', 
            ...data.Breakfast, 
            image: 'data:image/jpeg;base64,' + data.Breakfast.image 
          },
          { meal: 'LUNCH', 
            ...data.Lunch, 
            image: 'data:image/jpeg;base64,' + data.Lunch.image 
          },
          { meal: 'DINNER', 
            ...data.Dinner, 
            image: 'data:image/jpeg;base64,' + data.Dinner.image 
          }
        ];
        localStorage.setItem('dailyMeals', JSON.stringify(this.slides));
        localStorage.setItem('mealsDate', today);
        this.showSlide(this.currentSlide);
      });
    }
  }

  setSlide(index: number): void {
    this.currentSlide = index;
    this.showSlide(this.currentSlide);
    this.resetSlideInterval();
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

    const carouselInner = document.querySelector(
      '.carousel-inner'
    ) as HTMLElement;
    carouselInner.style.transform = `translateX(-${index * 100}%)`;
  }

  moveToPrevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.slides.length - 1;
    }
    this.showSlide(this.currentSlide);
    this.resetSlideInterval();
  }

  moveToNextSlide(): void {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }
    this.showSlide(this.currentSlide);
    this.resetSlideInterval();
  }

  startSlideInterval(): void {
    this.slideInterval = setInterval(() => {
      this.moveToNextSlide();
    }, 8000);
  }

  resetSlideInterval(): void {
    clearInterval(this.slideInterval);
    this.startSlideInterval();
  }
}