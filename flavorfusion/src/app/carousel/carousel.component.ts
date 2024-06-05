import { Component, OnInit } from '@angular/core';
import { CarouselService } from '../../services/carousel.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  slides = [];
  currentSlide = 0;

  constructor(private carouselService: CarouselService) { }

  ngOnInit(): void {
    // TODO(Asebuque, Chrystine Noelle): 
    // Replace mock data with service data once the backend is ready.
    this.carouselService.getSlides().subscribe(data => {
      this.slides = data;
      this.showSlide(this.currentSlide);
    });
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