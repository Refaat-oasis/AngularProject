import { Component } from '@angular/core';
import { SellerFooterComponent } from '../seller-footer-component/seller-footer-component';
import { SellerHeaderComponent } from '../seller-header-component/seller-header-component';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-seller-layout-component',
  imports: [ SellerHeaderComponent, RouterModule , SellerFooterComponent],
  templateUrl: './seller-layout-component.html',
  styleUrl: './seller-layout-component.css',
})
export class SellerLayoutComponent {}
