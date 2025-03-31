import { Component, inject } from '@angular/core';
import { addDoc, collection, doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { FirestoreService } from '../../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { InstagramService } from '../../../services/instagram.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {
  authService = inject(AuthService);
  instagramService = inject(InstagramService);
  firestore: Firestore = inject(Firestore);
  configId = '';
  error: string | null = null;
  connected: boolean = false;

  form = new FormGroup({
    url_api: new FormControl(''),
    token: new FormControl(''),
  });
  
  constructor(private http: HttpClient, private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.authService.user$.subscribe((user: User) => {
      getDoc(doc(this.firestore, 'users_instagram', user.uid)).then((res) => {
        this.form.setControl('url_api', new FormControl(res.data()!['api']['url_api']));
        this.form.setControl('token', new FormControl(res.data()!['api']['token']));
        if(res.data()!['api']['id']) {
          console.log(res.data())
          this.connected = true;
        }
      })
    })
  }
  connect() {
    this.instagramService.getData(this.form.value.url_api!, this.form.value.token!).subscribe({
      next: (data) => {
        console.info(`connecting success!`)
        updateDoc(doc(this.firestore, 'users_instagram', `${this.authService.curretUserSig()?.uid}`), {
          api: {
            url_api: this.form.value.url_api,
            token: this.form.value.token,
            ...data
          }
        }).then(() => {
          this.connected = true;
        })
      },
      error: (err) => {
        this.error = err.message;
        console.log(err.message)
      },
    })
  }
}
