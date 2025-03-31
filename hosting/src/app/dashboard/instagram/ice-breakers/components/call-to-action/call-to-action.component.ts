import { Component, EventEmitter, inject, Input, NgModule, Output } from '@angular/core';
import { ICallToAction } from '../../ice-breakers.component';
import { CommonModule } from '@angular/common';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { AuthService } from '../../../../../services/auth.service';
import {MatMenuModule} from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';

export interface ITemplate { 
  baseTemplates: IBaseTemplate[];
  textTemplates: ITextTemplate[];
  buttonTemplates: IButtonTemplate[];
}
export interface IBaseTemplate {
  title?: string;
  id?: string;
  template?: string;
}
export interface ITextTemplate {
  title?: string;
  id?: string;
}
export interface IButtonTemplate {
  title?: string;
  id?: string;
}



@Component({
  selector: 'app-call-to-action',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './call-to-action.component.html',
  styleUrl: './call-to-action.component.scss'
})
export class CallToActionComponent {
  authService = inject(AuthService);
  router = inject(Router);
  @Input() callToAction: ICallToAction = {} as ICallToAction;
  @Input() iceBreakerId: string = '';
  @Output() remove = new EventEmitter<void>();
  templates: ITemplate[] = [];
  editElement = false;
  constructor(private firestore: Firestore) {}

  baseTemplates: IBaseTemplate[] = [];
  textTemplates: ITextTemplate[] = [];
  buttonTemplates: IButtonTemplate[] = [];

  ngOnInit() {
    if(!this.callToAction.id) {
      this.editElement = true;
    }
  }
  edit() {
    this.editElement = true;
  }
  add() {
    addDoc(collection(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/ice_breakers/${this.iceBreakerId}/call_to_actions`), {
      ...this.callToAction
    }).then((res) => {
      this.callToAction = {
        ...this.callToAction,
        id: res.id,
      }
    });
    this.editElement = false;
  }
  save() {
    this.editElement = false;
    setDoc(doc(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/ice_breakers/${this.iceBreakerId}/call_to_actions/${this.callToAction.id}`), {
      question: this.callToAction.question,
      payload: this.callToAction.payload,
    }).then((res) => {
      // console.log(res);
    })
  }
  delete() {
    deleteDoc(doc(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/ice_breakers/${this.iceBreakerId}/call_to_actions`, `${this.callToAction.id}`)).then((res) => {
      this.remove.emit();
    });

  }
  changeActionName(e: any) {
    this.callToAction.question = e.target.value;
  }
  addAction(action: any) {
    this.callToAction.payload = `${action.template}-${action.id}`;
    this.save();
  }
  openBase() {
    getDocs(collection(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates`)).then((res) => {
      this.baseTemplates = [];
      res.docs.forEach((doc) => {
        this.baseTemplates.push({
          title: doc.data()["title"],
          id: doc.id,
          template: 'base_templates'
        })
      })
    })
  }
  openText() {

  }
  openButton() {
    
  }
}
