import { FormGroup, FormControl } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  loading = false;

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  
  errorMessage: string | null = null;

  ngOnInit() {
    this.authService.user$.subscribe((user: User) => {
      if(user) {
        this.router.navigateByUrl('/')
        // console.log(this.router.serializeUrl())
      }
    });
  }
  login(): void {
    this.authService
      .login(this.form.value.email!, this.form.value.password!)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/')
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      })
  }
}
