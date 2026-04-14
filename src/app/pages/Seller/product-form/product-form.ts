import { Component, OnInit, signal, computed } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  model = signal<any>({});
  isEditMode = signal(false);
  isLoading = signal(false);
  selectedFile = signal<File | null>(null);
  currentImageUrl = signal<string | null>(null);

  isSubmitDisabled = computed(() => this.isLoading());

  // Getters & Setters for ngModel
  get name() { return this.model().name; }
  set name(val: string) { this.model.update(m => ({ ...m, name: val })); }

  get description() { return this.model().description; }
  set description(val: string) { this.model.update(m => ({ ...m, description: val })); }

  get price() { return this.model().price; }
  set price(val: any) { this.model.update(m => ({ ...m, price: val })); }

  get stock() { return this.model().stock; }
  set stock(val: any) { this.model.update(m => ({ ...m, stock: val })); }

  get categoryId() { return this.model().categoryId; }
  set categoryId(val: any) { this.model.update(m => ({ ...m, categoryId: val })); }

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.isLoading.set(true);

      this.productService.getById(+id).subscribe({
        next: (res) => {
          this.model.set(res);
          this.currentImageUrl.set(res.image ?? null);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentImageUrl.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    const current = this.model();
    const formData = new FormData();

    formData.append('name', current.name);
    formData.append('description', current.description);
    formData.append('price', current.price);
    formData.append('stock', current.stock);
    formData.append('categoryId', current.categoryId);

    const file = this.selectedFile();
    if (file) {
      formData.append('image', file);
    }

    if (this.isEditMode()) {
      this.productService.update(current.id, formData).subscribe(() => {
        this.router.navigate(['/seller/products']);
      });
    } else {
      this.productService.create(formData).subscribe(() => {
        this.router.navigate(['/seller/products']);
      });
    }
  }
}
