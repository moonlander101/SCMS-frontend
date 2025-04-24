// hero.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { interval, Subscription } from 'rxjs';

// Add the missing Slide interface
interface Slide {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
}

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '900ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  slides: Slide[] = [
    {
      image: 'assets/images/spices-bg.jpg',

      title: 'Fresh Spices from Farm to Kitchen',
      subtitle: 'Discover authentic flavor with premium handpicked spices sourced directly from trusted growers.',
      cta: 'Shop Now',
      ctaLink: '/products',
    },
    {
      image: 'assets/images/spices-bg1.jpg',
      title: 'Signature Spice Blends',
      subtitle: 'Perfectly crafted blends to elevate your cooking curated by culinary experts.',
      cta: 'Explore Blends',
      ctaLink: '/blends',
    },
    {
      image: 'assets/images/spices-bg3.jpg',
      title: 'Partner With Us as a Supplier',
      subtitle: 'Join our global network and grow your reach in the world of gourmet spices.',
      cta: 'Become a Supplier',
      ctaLink: '/join/supplier',
    }
  ];
  ;

  activeSlide = 0;
  private readonly SLIDE_INTERVAL = 5000; // 5 seconds
  private autoplaySubscription: Subscription | null = null;

  ngOnInit(): void {
    console.log('HeroSliderComponent: ngOnInit');
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    console.log('HeroSliderComponent: ngOnDestroy');
    this.stopAutoplay();
  }

  startAutoplay(): void {
    this.stopAutoplay(); // Ensure no duplicate subscriptions
    console.log('HeroSliderComponent: Starting autoplay');
    this.autoplaySubscription = interval(this.SLIDE_INTERVAL).subscribe(() => {
      console.log('HeroSliderComponent: Interval triggered, calling nextSlide');
      this.nextSlide();
    });
  }

  stopAutoplay(): void {
    if (this.autoplaySubscription) {
      console.log('HeroSliderComponent: Stopping autoplay');
      this.autoplaySubscription.unsubscribe();
      this.autoplaySubscription = null;
    }
  }

  nextSlide(): void {
    const oldSlide = this.activeSlide;
    this.activeSlide = (this.activeSlide + 1) % this.slides.length;
    console.log(
      `HeroSliderComponent: nextSlide - Changed activeSlide from ${oldSlide} to ${this.activeSlide}`
    );
    this.startAutoplay(); // Reset timer
  }

  prevSlide(): void {
    const oldSlide = this.activeSlide;
    this.activeSlide =
      (this.activeSlide - 1 + this.slides.length) % this.slides.length;
    console.log(
      `HeroSliderComponent: prevSlide - Changed activeSlide from ${oldSlide} to ${this.activeSlide}`
    );
    this.startAutoplay(); // Reset timer
  }

  goToSlide(index: number): void {
    if (this.activeSlide !== index) {
      const oldSlide = this.activeSlide;
      this.activeSlide = index;
      console.log(
        `HeroSliderComponent: goToSlide - Changed activeSlide from ${oldSlide} to ${this.activeSlide}`
      );
      this.startAutoplay(); // Reset timer
    } else {
      console.log(`HeroSliderComponent: goToSlide - Already on slide ${index}`);
    }
  }

  getSlideState(index: number): string {
    const slideCount = this.slides.length;
    if (this.activeSlide === index) {
      return 'active';
    } else if (index === (this.activeSlide + 1) % slideCount) {
      return 'next';
    } else if (index === (this.activeSlide - 1 + slideCount) % slideCount) {
      return 'prev';
    } else {
      return 'prev'; // Slides further away are treated as 'prev' for transition out
    }
  }
}
