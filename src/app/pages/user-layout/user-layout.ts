import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

import {RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  imports: [NavbarComponent, FooterComponent , RouterOutlet],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayout {}
