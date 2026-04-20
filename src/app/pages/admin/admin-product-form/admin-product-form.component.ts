import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../services/category-service';
import { AdminProductsService } from '../../../services/admin-products.service';
import { Icategory } from '../../../models/icategory';
import { environment } from '../../../environment';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.css'
})
export class AdminProductFormComponent implements OnInit {
  model = signal({
    id: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '' as number | '',
    image: ''
  });
  isEditMode = signal(false);
  loading = signal(false);
  isSubmitting = signal(false);
  selectedFile = signal<File | null>(null);
  currentImageUrl = signal<string | null>(null);
  categories = signal<Icategory[]>([]);
  imageError = signal<string | null>(null);
  error = signal<string | null>(null);
  readonly imageBaseUrl = environment.baseUrl;

  isSubmitDisabled = computed(() => this.loading() || this.isSubmitting() || !!this.imageError());

  get name(): string { return this.model().name; }
  set name(value: string) { this.model.update((m) => ({ ...m, name: value })); }

  get description(): string { return this.model().description; }
  set description(value: string) { this.model.update((m) => ({ ...m, description: value })); }

  get price(): number { return this.model().price; }
  set price(value: number) { this.model.update((m) => ({ ...m, price: value })); }

  get stock(): number { return this.model().stock; }
  set stock(value: number) { this.model.update((m) => ({ ...m, stock: value })); }

  get categoryId(): number | '' { return this.model().categoryId; }
  set categoryId(value: number | '') { this.model.update((m) => ({ ...m, categoryId: value })); }

  constructor(
    private adminProductsService: AdminProductsService,
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
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error(err)
    });
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.adminProductsService.getById(id).subscribe({
      next: (product) => {
        this.model.set({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
          image: product.image
        });
        this.currentImageUrl.set(this.getImageUrl(product.image));
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.imageError.set(null);

    if (!file) {
      this.selectedFile.set(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.imageError.set('Please upload JPG, PNG, WEBP, or GIF images only.');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.imageError.set('Image size must be 5 MB or less.');
      input.value = '';
      return;
    }

    this.selectedFile.set(file);
    this.currentImageUrl.set(URL.createObjectURL(file));
  }

  submit(): void {
    const current = this.model();
    if (!current.categoryId) return;

    this.isSubmitting.set(true);

    const formData = new FormData();
    formData.append('name', current.name);
    formData.append('description', current.description);
    formData.append('price', String(current.price));
    formData.append('stock', String(current.stock));
    formData.append('categoryId', String(current.categoryId));

    const file = this.selectedFile();
    if (file) formData.append('image', file);

    const request: Observable<unknown> = this.isEditMode()
      ? this.adminProductsService.update(current.id, formData)
      : this.adminProductsService.create(formData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
      }
    });
  }

  private getImageUrl(path: string): string | null {
    if (!path) return null;
    return path.startsWith('http') ? path : `${this.imageBaseUrl}${path}`;
  }
}
