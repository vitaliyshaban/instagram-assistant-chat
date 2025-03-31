import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { InstagramService } from '../services/instagram.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  authService = inject(AuthService);
  instagramService = inject(InstagramService);
  router = inject(Router);
  menuOpen: boolean = false;

  show = false;

  // ngOnInit() {
  //   this.authService.user$.subscribe((user: User) => {
  //     if(user) {
  //       // console.log(user)
  //     }  
  //   });
  // }
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/login')
    })
  }
  showMenu() {
    this.show = !this.show;
  }
}
