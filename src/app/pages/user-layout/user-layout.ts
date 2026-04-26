import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer';
import { NavbarComponent } from '../../shared/components/navbar/navbar';

import {RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  imports: [NavbarComponent, FooterComponent , RouterOutlet],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayoutComponent {}
