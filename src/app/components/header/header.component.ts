import { Component, HostListener } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; // Add these imports

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true, // Add this if it's not already there
  imports: [NgFor, NgClass, RouterLink, RouterLinkActive], // Add RouterLink and RouterLinkActive
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  navLinks = [
    { name: 'Dashboard', url: '/dashboard', icon: 'speedometer2' },
    { name: 'Forecasting', url: '/forecasting', icon: 'graph-up' },
    { name: 'Order Tracking', url: '/orders', icon: 'box-seam' },
    { name: 'Suppliers', url: '/suppliers', icon: 'building' },
    { name: 'Logistics', url: '/logistics', icon: 'truck' },
    { name: 'Analytics', url: '/analytics', icon: 'bar-chart' },
    { name: 'Login', url: '/auth', icon: 'login' },
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
    }
  }
}
