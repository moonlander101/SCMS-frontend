import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroSliderComponent } from '../../components/hero/hero.component';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, HeroSliderComponent],
    template: `
          <app-navbar></app-navbar>
          <main class="pt-17">
          <app-hero-slider></app-hero-slider>
          </main>
          <router-outlet></router-outlet>
    `,
  })
export class MainLayoutComponent {}