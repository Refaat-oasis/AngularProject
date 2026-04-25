import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  AdminCategory,
  AdminCategoryWithProducts
} from '../../../models/admin-category.models';
import { AdminCategoriesService } from '../../../services/admin-categories.service';
import { environment } from '../../../environment';

type DeleteMode = 'safe' | 'force';

@Component({
  selector: 'app-categories-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-management.component.html',
  styleUrl: './categories-management.component.css'
})
export class CategoriesManagementComponent implements OnInit {
  categories = signal<AdminCategory[]>([]);
  searchTerm = signal('');
  loading = signal(false);
  submitting = signal(false);
  detailLoading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  showFormModal = signal(false);
  editingCategoryId = signal<number | null>(null);
  formName = signal('');
  selectedFile = signal<File | null>(null);
  imagePreview = signal('');
  imageError = signal<string | null>(null);

  showDetailsModal = signal(false);
  selectedCategoryDetails = signal<AdminCategoryWithProducts | null>(null);

  showDeleteOptionsModal = signal(false);
  showDeleteConfirmModal = signal(false);
  pendingDeleteCategory = signal<AdminCategory | null>(null);
  deleteMode = signal<DeleteMode>('safe');

  readonly imageBaseUrl = environment.baseUrl;
  readonly fallbackImage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" fill="#f7fafc"/>' +
        '<circle cx="220" cy="150" r="44" fill="#cbd5e0"/>' +
        '<path d="M120 320l110-100 70 58 64-76 116 118H120z" fill="#a0aec0"/>' +
        '<text x="300" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#4a5568">Category</text>' +
      '</svg>'
    );

  filteredCategories = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.categories().filter((c) =>
      !term || c.name.toLowerCase().includes(term) || String(c.id).includes(term)
    );
  });

  totalCategories = computed(() => this.categories().length);
  filteredCount = computed(() => this.filteredCategories().length);
  totalProductsInDetails = computed(() => this.selectedCategoryDetails()?.products.length ?? 0);

  constructor(private adminCategoriesService: AdminCategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.adminCategoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  trackByCategoryId(index: number, category: AdminCategory): number {
    return category.id;
  }

  openCreateModal(): void {
    this.resetForm();
    this.showFormModal.set(true);
  }

  openEditModal(category: AdminCategory): void {
    this.resetForm();
    this.editingCategoryId.set(category.id);
    this.formName.set(category.name);
    this.imagePreview.set(this.getImageUrl(category.imageUrl));
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.resetForm();
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
    this.imagePreview.set(URL.createObjectURL(file));
  }

  saveCategory(): void {
    if (this.submitting() || !this.formName().trim() || this.imageError()) return;

    this.submitting.set(true);
    this.success.set(null);

    const formData = new FormData();
    formData.append('Name', this.formName().trim());
    const file = this.selectedFile();
    if (file) formData.append('Image', file);

    const editId = this.editingCategoryId();
    const request: Observable<any> = editId === null
      ? this.adminCategoriesService.create(formData)
      : this.adminCategoriesService.update(editId, formData);

    request.subscribe({
      next: () => {
        this.success.set(editId === null ? 'Category created successfully.' : 'Category updated successfully.');
        this.submitting.set(false);
        this.closeFormModal();
        this.loadCategories();
      },
      error: (err: any) => {
        console.error(err);
        this.submitting.set(false);
      }
    });
  }

  openDetailsModal(category: AdminCategory): void {
    this.showDetailsModal.set(true);
    this.selectedCategoryDetails.set(null);
    this.detailLoading.set(true);

    this.adminCategoriesService.getWithProducts(category.id).subscribe({
      next: (details) => {
        this.selectedCategoryDetails.set(details);
        this.detailLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.closeDetailsModal();
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedCategoryDetails.set(null);
    this.detailLoading.set(false);
  }

  openDeleteOptions(category: AdminCategory): void {
    this.pendingDeleteCategory.set(category);
    this.deleteMode.set('safe');
    this.showDeleteOptionsModal.set(true);
  }

  chooseDeleteMode(mode: DeleteMode): void {
    this.deleteMode.set(mode);
    this.showDeleteOptionsModal.set(false);
    this.showDeleteConfirmModal.set(true);
  }

  closeDeleteModals(): void {
    this.showDeleteOptionsModal.set(false);
    this.showDeleteConfirmModal.set(false);
    this.pendingDeleteCategory.set(null);
    this.deleteMode.set('safe');
  }

  confirmDelete(): void {
    const category = this.pendingDeleteCategory();
    if (!category) return;

    const mode = this.deleteMode();
    const request: Observable<any> = mode === 'safe'
      ? this.adminCategoriesService.delete(category.id)
      : this.adminCategoriesService.forceDelete(category.id);

    request.subscribe({
      next: () => {
        this.success.set(
          mode === 'safe'
            ? 'Category deleted. Products were moved to Others if needed.'
            : 'Category deleted and its products were soft-deleted.'
        );
        this.closeDeleteModals();
        this.loadCategories();
      },
      error: (err: any) => console.error(err)
    });
  }

  getImageUrl(path: string): string {
    if (!path) return this.fallbackImage;
    if (path.startsWith('data:image') || path.startsWith('http')) return path;
    // Bare filename with no path separator (e.g. "category.jpg") → unresolvable
    if (!path.includes('/')) return this.fallbackImage;
    return path.startsWith('/') ? `${this.imageBaseUrl}${path}` : `${this.imageBaseUrl}/${path}`;
  }

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image || image.src === this.fallbackImage) return;
    image.src = this.fallbackImage;
  }

  private resetForm(): void {
    this.editingCategoryId.set(null);
    this.formName.set('');
    this.selectedFile.set(null);
    this.imagePreview.set('');
    this.imageError.set(null);
  }
}
