import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  private router = inject(Router);
  newsletterEmail = '';
  newsletterMessage = '';
  newsletterError = '';

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  submitNewsletter() {
    const email = this.newsletterEmail.trim();
    this.newsletterMessage = '';
    this.newsletterError = '';

    if (!email) {
      this.newsletterError = 'Enter an email address to subscribe.';
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      this.newsletterError = 'Enter a valid email address.';
      return;
    }

    this.newsletterMessage = 'Thanks for joining. We will share new collection updates soon.';
    this.newsletterEmail = '';
  }
}
