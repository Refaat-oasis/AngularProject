import { Component, OnInit } from '@angular/core';
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
  vendors: Vendor[] = [];

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getVendors().subscribe((v: Vendor[]) => this.vendors = v);
  }
}
