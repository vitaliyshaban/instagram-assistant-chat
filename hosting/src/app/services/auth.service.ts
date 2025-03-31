import { inject, Injectable, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { IUser } from '../interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  curretUserSig = signal<IUser | null | undefined>(undefined);


  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {});
    return from(promise)
  }
  logout() {
    const promise = signOut(this.firebaseAuth);
    return from(promise)
  }
}
