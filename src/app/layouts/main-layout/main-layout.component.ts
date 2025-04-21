import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeroSliderComponent } from '../../components/hero/hero.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet, FooterComponent, HeroSliderComponent, HeaderComponent],
    template: `<app-header></app-header>
                <app-hero-slider></app-hero-slider>
                <router-outlet></router-outlet>
                <app-footer></app-footer>`,
  })
export class MainLayoutComponent {}