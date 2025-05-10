import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { LucideAngularModule, FileIcon, PanelLeft } from 'lucide-angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    RouterOutlet,
    LucideAngularModule,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
})
export class DashboardLayoutComponent implements OnInit {
  readonly FileIcon = FileIcon;
  readonly panelLeft = PanelLeft;
  sidebarClosed = false;
  isProfilePage = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.checkIfProfilePage(this.router.url);

    // Subscribe to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkIfProfilePage(event.url);
      });
  }

  checkIfProfilePage(url: string) {
    // Check if the current URL contains 'profile'
    this.isProfilePage = url.includes('/profile');
  }

  handleSidebarClosed() {
    this.sidebarClosed = !this.sidebarClosed;
  }
}
