import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDocs, getDoc, doc } from '@angular/fire/firestore';
import { IceBreakersBodyComponent } from './ice-breakers-body/ice-breakers-body.component';
import { HttpClient } from '@angular/common/http';
import { InstagramService } from '../../../services/instagram.service';
import { InstagramTemplateComponent } from '../components/instagram-template/instagram-template.component';

export interface IIceBreakers {
  call_to_actions?: ICallToAction[];
  locale?: string;
  id?: string;
}
export interface ICallToAction {
  question: string;
  payload: string;
  id?: string;
}


@Component({
  selector: 'app-ice-breakers',
  standalone: true,
  imports: [
    CommonModule,
    IceBreakersBodyComponent,
    InstagramTemplateComponent
  ],
  templateUrl: './ice-breakers.component.html',
  styleUrl: './ice-breakers.component.scss'
})
export class IceBreakersComponent {
  iceBreakersBodyComponent = IceBreakersBodyComponent;
  authService = inject(AuthService);
  instagramService = inject(InstagramService);
  iceBreakers: IIceBreakers[] = [];
  activated = false;

  constructor(private http: HttpClient, private firestore: Firestore) {}
  ngOnInit() {
    this.authService.user$.subscribe(async (user: User) => {
      getDocs(collection(this.firestore, `users_instagram/${user.uid}/ice_breakers`)).then((res) => {
        res.docs.forEach(async (doc) => {
          const callToActions: ICallToAction[] = [];
          (await getDocs(collection(this.firestore, `users_instagram/${user.uid}/ice_breakers/${doc.id}/call_to_actions`))).forEach((act) => {
            callToActions.push({...act.data() as ICallToAction, id: act.id});
          })
          this.iceBreakers.push({
            ...doc.data(),
            id: doc.id,
            call_to_actions: callToActions
          })
          // console.log(this.iceBreakers);
        });
      })

      getDoc(doc(this.firestore, 'users_instagram', user.uid)).then((res) => {
        // console.log(res.data())
        this.http.get<any>(`${res.data()!['api']['url_api']}/v11.0/me/messenger_profile?fields=ice_breakers&platform=instagram&access_token=${res.data()!['api']['token']}`).subscribe((res) => {
          // console.log(res);
          res.data.length ? this.activated = true : this.activated = false;
        });
      })
    })
    
  }
  activate() {
    this.activated = !this.activated;
    const data = {
      "platform": "instagram",
      ice_breakers: [
        ...this.iceBreakers.reduce((res: any, itm) => {
          return [
            ...res,
            {
              call_to_actions: itm.call_to_actions!.reduce((result: any, cal) => {
                return [
                  ...result,
                  {
                    question: cal.question,
                    payload: cal.payload
                  }
                ]
              }, []),
              locale: itm.locale
            }
          ]
        }, []) as any,
      ],  
    };
    this.http.post<any>(`${this.authService.curretUserSig()?.api?.url_api}/v20.0/me/messenger_profile?access_token=${this.authService.curretUserSig()?.api?.token}`, data).subscribe((res) => {
      // console.log(res);
      this.activated = true;
    });
}
  deactivate() {
    this.http.delete<any>(`${this.authService.curretUserSig()?.api?.url_api}/v11.0/me/messenger_profile?fields=["ice_breakers"]&platform=instagram&access_token=${this.authService.curretUserSig()?.api?.token}`).subscribe((res) => {
      // console.log(res);
      this.activated = false;
    });
  }

  createIceBreaker() {
    this.iceBreakers = [
      ...this.iceBreakers,
      {
        locale: "default",
        id: '',
        call_to_actions: []
      }
    ]
  }
}
