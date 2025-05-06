import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/home-page/navbar/navbar.component';
import { HeroSliderComponent } from '../../components/home-page/hero/hero.component';
import { AboutUsComponent } from '../../components/home-page/about-us/about-us.component';
import { FooterComponent } from '../../components/home-page/footer/footer.component';
import { JoinNetworkComponent } from '../../components/home-page/join-network/join-network.component';
import { ProductSectionComponent } from '../../components/home-page/product-section/product-section.component';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, HeroSliderComponent, AboutUsComponent, FooterComponent, JoinNetworkComponent, ProductSectionComponent],
    template: `
          <app-navbar></app-navbar>
          <main class="pt-17">
          <app-hero-slider></app-hero-slider>
          <app-about-us></app-about-us>
          <app-product-section></app-product-section>
          <app-join-network></app-join-network>
          <app-footer></app-footer>
          </main>
          <router-outlet></router-outlet>
    `,
  })
export class MainLayoutComponent {}
