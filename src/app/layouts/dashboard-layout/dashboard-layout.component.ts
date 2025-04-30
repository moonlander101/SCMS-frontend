import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { LucideAngularModule, FileIcon, PanelLeft } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-layout',
  imports: [SidebarComponent, RouterOutlet, LucideAngularModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
  readonly FileIcon = FileIcon;
  readonly panelLeft = PanelLeft
  sidebarClosed : boolean = false;

  handleSidebarClosed() {
    console.log("clicked")
    this.sidebarClosed = !this.sidebarClosed
  }
}
