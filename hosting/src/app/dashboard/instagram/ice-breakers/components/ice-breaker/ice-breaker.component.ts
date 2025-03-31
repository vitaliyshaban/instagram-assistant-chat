import { Component, inject, Input } from '@angular/core';
import { IIceBreakers } from '../../ice-breakers.component';
import { CommonModule } from '@angular/common';
import { CallToActionComponent } from '../call-to-action/call-to-action.component';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-ice-breaker',
  standalone: true,
  imports: [
    CommonModule,
    CallToActionComponent
  ],
  templateUrl: './ice-breaker.component.html',
  styleUrl: './ice-breaker.component.scss'
})
export class IceBreakerComponent {
  authService = inject(AuthService);
  @Input() iceBreaker: IIceBreakers = {} as IIceBreakers;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    if(!this.iceBreaker.id) {
      addDoc(collection(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/ice_breakers`), {
        locale: "default"
      }).then((res) => {
        this.iceBreaker.id = res.id;
        // console.log(res.id)
      })
    }
  }
  addCallToAction() {
    this.iceBreaker = {
      ...this.iceBreaker,
      call_to_actions: [
        ...this.iceBreaker.call_to_actions!,
        {
          question: '',
          payload: 'test',
        }
      ]
    }
  }
  deleteCallToAction(index: number) {
    this.iceBreaker.call_to_actions?.splice(index, 1);
  }
}
