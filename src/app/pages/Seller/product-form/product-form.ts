import { Component, OnInit, signal, computed } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category-service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductFormComponent implements OnInit {
  model = signal<any>({});
  isEditMode = signal(false);
  loading = signal(false);
  isSubmitting = signal(false);
  selectedFile = signal<File | null>(null);
  currentImageUrl = signal<string | null>(null);
  baseUrl = `${environment.baseUrl}/images/products/`;
  categories = signal<any[]>([]);
  imageError = signal<string | null>(null);

  isSubmitDisabled = computed(() => this.loading() || this.isSubmitting() || !!this.imageError());

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
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.loadProduct(+id);
    }
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => this.categories.set(res),
      error: (err) => console.error(err)
    });
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: (res) => {
        this.model.set(res);
        this.currentImageUrl.set(this.getImageUrl(res));
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  getImageUrl(product: any): string | null {
    if (!product) return null;
    const path = product.imageUrl || product.image;
    if (!path) return null;
    if (path.startsWith('data:image') || path.startsWith('http')) return path;
    // Bare filename with no path separator (e.g. "product.jpg") → unresolvable
    if (!path.includes('/')) return null;
    return path.startsWith('/') ? `${environment.baseUrl}${path}` : `${environment.baseUrl}/${path}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.imageError.set(null);

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSizeBytes = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.imageError.set('Invalid file type. Please upload a JPG, PNG, WEBP, or GIF image.');
      input.value = '';
      return;
    }

    if (file.size > maxSizeBytes) {
      this.imageError.set('File is too large. Maximum allowed size is 5 MB.');
      input.value = '';
      return;
    }

    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.currentImageUrl.set(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  submit(): void {
    const current = this.model();

    this.isSubmitting.set(true);

    const formData = new FormData();
    formData.append('name', current.name);
    formData.append('description', current.description);
    formData.append('price', current.price);
    formData.append('stock', current.stock);
    formData.append('categoryId', current.categoryId);

    const file = this.selectedFile();
    if (file) formData.append('image', file);

    const request = this.isEditMode()
      ? this.productService.update(current.id, formData)
      : this.productService.create(formData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/seller/products']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/seller/products']);
  }
}
