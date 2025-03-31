import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instagram',
  standalone: true,
  imports: [],
  templateUrl: './instagram.component.html',
  styleUrl: './instagram.component.scss'
})
export class InstagramComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/login')
    })
  }
}
