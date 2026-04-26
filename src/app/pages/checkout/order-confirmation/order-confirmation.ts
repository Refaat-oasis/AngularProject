import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css'
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string = '';

  constructor(private route: ActivatedRoute, public authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
    });
  }
}
