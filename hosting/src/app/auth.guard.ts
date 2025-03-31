import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';  // Сервис аутентификации
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    return this.authService.user$.subscribe((user: User) => {
      if(user) {
        return true;
      } else {
        this.router.navigate(['/login']); 
        return false;
      }
    });
  }
}
