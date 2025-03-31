import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { IUser } from './interfaces/user';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AppModule } from './app.module';
import { InstagramService } from './services/instagram.service';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<div>
    <router-outlet />
  </div>`
})
export class AppComponent {
  authService = inject(AuthService);
  instagramService = inject(InstagramService);
  router = inject(Router);
  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.authService.user$.subscribe((user: User) => {
      // console.log(user)
      if(user) {
        getDoc(doc(this.firestore, 'users_instagram', user.uid)).then((res) => {
          if(res.data() === undefined) {
            setDoc(doc(this.firestore, 'users_instagram', user.uid), {
              email: user.email!,
              displayName: user.displayName!,
              api: {
                url_api: '',
                token: '',
                id: '',
                name: '',
              },
            }).then((res) => {
              this.authService.curretUserSig.set({
                email: user.email!,
                displayName: user.displayName!,
                uid: user.uid,
                api: {
                  url_api: '',
                  token: '',
                  id: '',
                  name: '',
                },
              })
            })
          }
          this.authService.curretUserSig.set({
            email: user.email!,
            displayName: user.displayName!,
            uid: user.uid,
            api: res.data()!['api'] ? res.data()!['api'] : {
              url_api: '',
              token: '',
              id: '',
              name: '',
            },
          })
        });
      } else {
        this.authService.curretUserSig.set(null)
      }
    });
  }
}
