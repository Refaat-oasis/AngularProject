import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Vendor } from '../../../../services/mock-data.service';

@Component({
  selector: 'app-artisans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artisans.component.html',
  styleUrl: './artisans.component.css'
})
export class ArtisansComponent implements OnInit {
  vendors = signal<Vendor[]>([]);
  loading = signal(false);

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.loading.set(true);
    this.dataService.getVendors().subscribe({
      next: (v: Vendor[]) => {
        this.vendors.set(v);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
}
