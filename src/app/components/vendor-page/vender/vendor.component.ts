import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  imports: [RouterLink],
})
export class VendorComponent {
  user = {
    name: "Alice Fernando",
    role: "Tea Supplier",
  };
}
