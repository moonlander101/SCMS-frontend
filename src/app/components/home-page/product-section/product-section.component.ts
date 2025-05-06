import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-section',
  imports: [
    CommonModule, // This includes NgFor and NgClass
    RouterLink,
  ],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.css',
})
export class ProductSectionComponent {
  selectedCategory = 'All';

  categories = ['All', 'Powders', 'Whole Spices', 'Blends'];

  products = [
    {
      name: 'Turmeric Powder',
      subtitle: 'Organic • 200g',
      price: 4.99,
      category: 'Powders',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Garam Masala',
      subtitle: 'Premium Blend • 150g',
      price: 6.49,
      category: 'Blends',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Cinnamon Sticks',
      subtitle: 'Ceylon • 100g',
      price: 3.99,
      category: 'Whole Spices',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Chili Powder',
      subtitle: 'Smoky Heat • 100g',
      price: 2.99,
      category: 'Powders',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Cloves',
      subtitle: 'Whole • 50g',
      price: 5.99,
      category: 'Whole Spices',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Black Pepper',
      subtitle: 'Tellicherry • 100g',
      price: 4.49,
      category: 'Whole Spices',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Cardamom Pods',
      subtitle: 'Green • 75g',
      price: 7.99,
      category: 'Whole Spices',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Cumin Seeds',
      subtitle: 'Whole • 150g',
      price: 2.49,
      category: 'Whole Spices',
      image: 'assets/images/products/spices-bg1.jpg',
    },
  ];

  get filteredProducts() {
    return this.selectedCategory === 'All'
      ? this.products
      : this.products.filter((p) => p.category === this.selectedCategory);
  }

  selectedProduct: any = null;

  openProductModal(product: any) {
    this.selectedProduct = product;
  }

  closeProductModal() {
    this.selectedProduct = null;
  }

  ngOnInit(): void {
    window.addEventListener('keydown', this.handleKeydown);
  }
  
  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeydown);
  }
  
  handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.closeProductModal();
  };
  
}
