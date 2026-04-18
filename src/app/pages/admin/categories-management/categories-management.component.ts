import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  AdminCategory,
  AdminCategoryWithProducts
} from '../../../models/admin-category.models';
import { AdminCategoriesService } from '../../../services/admin-categories.service';

type DeleteMode = 'safe' | 'force';

@Component({
  selector: 'app-categories-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-management.component.html',
  styleUrl: './categories-management.component.css'
})
export class CategoriesManagementComponent implements OnInit {
  categories: AdminCategory[] = [];
  searchTerm = '';
  loading = false;
  submitting = false;
  detailLoading = false;
  error: string | null = null;
  success: string | null = null;

  showFormModal = false;
  editingCategoryId: number | null = null;
  formName = '';
  selectedFile: File | null = null;
  imagePreview = '';
  imageError: string | null = null;

  showDetailsModal = false;
  selectedCategoryDetails: AdminCategoryWithProducts | null = null;

  showDeleteOptionsModal = false;
  showDeleteConfirmModal = false;
  pendingDeleteCategory: AdminCategory | null = null;
  deleteMode: DeleteMode = 'safe';

  readonly imageBaseUrl = 'http://localhost:5118';
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

  constructor(
    private adminCategoriesService: AdminCategoriesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  get filteredCategories(): AdminCategory[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.categories.filter((category) =>
      !term ||
      category.name.toLowerCase().includes(term) ||
      String(category.id).includes(term)
    );
  }

  get totalCategories(): number {
    return this.categories.length;
  }

  get filteredCount(): number {
    return this.filteredCategories.length;
  }

  get totalProductsInDetails(): number {
    return this.selectedCategoryDetails?.products.length ?? 0;
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.adminCategoriesService.getAll()
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.cdr.detectChanges();
        },
        error: (error: unknown) => {
          console.error(error);
          this.error = 'Failed to load categories.';
          this.cdr.detectChanges();
        }
      });
  }

  trackByCategoryId(index: number, category: AdminCategory): number {
    return category.id;
  }

  openCreateModal(): void {
    this.resetForm();
    this.showFormModal = true;
  }

  openEditModal(category: AdminCategory): void {
    this.resetForm();
    this.editingCategoryId = category.id;
    this.formName = category.name;
    this.imagePreview = this.getImageUrl(category.imageUrl);
    this.showFormModal = true;
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.resetForm();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.imageError = null;

    if (!file) {
      this.selectedFile = null;
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.imageError = 'Please upload JPG, PNG, WEBP, or GIF images only.';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.imageError = 'Image size must be 5 MB or less.';
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.imagePreview = URL.createObjectURL(file);
  }

  saveCategory(): void {
    if (this.submitting || !this.formName.trim() || this.imageError) {
      return;
    }

    this.submitting = true;
    this.error = null;
    this.success = null;

    const formData = new FormData();
    formData.append('Name', this.formName.trim());
    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    if (this.editingCategoryId === null) {
      this.adminCategoriesService.create(formData)
        .pipe(finalize(() => {
          this.submitting = false;
          this.cdr.detectChanges();
        }))
        .subscribe({
          next: () => {
            this.success = 'Category created successfully.';
            this.closeFormModal();
            this.loadCategories();
          },
          error: (error: unknown) => {
            console.error(error);
            this.error = 'Failed to save category.';
            this.cdr.detectChanges();
          }
        });

      return;
    }

    this.adminCategoriesService.update(this.editingCategoryId, formData)
      .pipe(finalize(() => {
        this.submitting = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.success = 'Category updated successfully.';
          this.closeFormModal();
          this.loadCategories();
        },
        error: (error: unknown) => {
          console.error(error);
          this.error = 'Failed to save category.';
          this.cdr.detectChanges();
        }
      });
  }

  openDetailsModal(category: AdminCategory): void {
    this.showDetailsModal = true;
    this.selectedCategoryDetails = null;
    this.detailLoading = true;

    this.adminCategoriesService.getWithProducts(category.id)
      .pipe(finalize(() => {
        this.detailLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (details) => {
          this.selectedCategoryDetails = details;
          this.cdr.detectChanges();
        },
        error: (error: unknown) => {
          console.error(error);
          this.error = 'Failed to load category details.';
          this.closeDetailsModal();
          this.cdr.detectChanges();
        }
      });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedCategoryDetails = null;
    this.detailLoading = false;
  }

  openDeleteOptions(category: AdminCategory): void {
    this.pendingDeleteCategory = category;
    this.deleteMode = 'safe';
    this.showDeleteOptionsModal = true;
  }

  chooseDeleteMode(mode: DeleteMode): void {
    this.deleteMode = mode;
    this.showDeleteOptionsModal = false;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteModals(): void {
    this.showDeleteOptionsModal = false;
    this.showDeleteConfirmModal = false;
    this.pendingDeleteCategory = null;
    this.deleteMode = 'safe';
  }

  confirmDelete(): void {
    if (!this.pendingDeleteCategory) {
      return;
    }

    const request = this.deleteMode === 'safe'
      ? this.adminCategoriesService.delete(this.pendingDeleteCategory.id)
      : this.adminCategoriesService.forceDelete(this.pendingDeleteCategory.id);

    request.subscribe({
      next: () => {
        this.success = this.deleteMode === 'safe'
          ? 'Category deleted. Products were moved to Others if needed.'
          : 'Category deleted and its products were soft-deleted.';
        this.closeDeleteModals();
        this.loadCategories();
      },
      error: (error: unknown) => {
        console.error(error);
        this.error = 'Failed to delete category.';
        this.cdr.detectChanges();
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) {
      return this.fallbackImage;
    }

    if (path.startsWith('data:image') || path.startsWith('http')) {
      return path;
    }

    return path.startsWith('/') ? `${this.imageBaseUrl}${path}` : `${this.imageBaseUrl}/${path}`;
  }

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image || image.src === this.fallbackImage) {
      return;
    }

    image.src = this.fallbackImage;
  }

  private resetForm(): void {
    this.editingCategoryId = null;
    this.formName = '';
    this.selectedFile = null;
    this.imagePreview = '';
    this.imageError = null;
  }
}
