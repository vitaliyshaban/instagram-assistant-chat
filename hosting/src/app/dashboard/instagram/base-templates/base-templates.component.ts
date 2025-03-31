import { Component, inject } from '@angular/core';
import { InstagramTemplateComponent } from '../components/instagram-template/instagram-template.component';
import { CommonModule } from '@angular/common';
import { BaseTemplateComponent } from './components/base-template/base-template.component';
import { AuthService } from '../../../services/auth.service';
import { addDoc, collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { FirestoreService } from '../../../services/firestore.service';
import { User } from '@angular/fire/auth';

export interface IBaseTemplate {
  template_type?: string;
  elements?: IElement[];
  id?: string;
  title?: string;
}
export interface IElement {
  title?: string;
  image_url?: string;
  subtitle?: string;
  buttons?: IButton[];
  id?: string;
}
export interface IButton {
  id?: string;
  type?: string;
  url?: string;
  title?: string;
  payload?: string;
  order?: number;
}

@Component({
  selector: 'app-base-templates',
  standalone: true,
  imports: [
    CommonModule,
    InstagramTemplateComponent,
    BaseTemplateComponent
  ],
  templateUrl: './base-templates.component.html',
  styleUrl: './base-templates.component.scss'
})
export class BaseTemplatesComponent {
  authService = inject(AuthService);
  baseTemplateComponent = BaseTemplateComponent;
  baseTemplateIndex = 0;
  baseTemplates: IBaseTemplate[] = [];

  constructor(private http: HttpClient, private firestore: Firestore) {}
  ngOnInit() {
    this.authService.user$.subscribe(async (user: User) => {
      getDocs(collection(this.firestore, `users_instagram/${user.uid}/base_templates`)).then((res) => {
        res.docs.forEach((doc) => {
          this.baseTemplates.push({
            ...doc.data(),
            elements: doc.data()["elements"] ? doc.data()["elements"] : [],
            id: doc.id,
            title: doc.data()["title"]
          })
        })
      })
    })
  }
  createBaseTemplates() {
    this.baseTemplates = [
      ...this.baseTemplates,
      {
        template_type: "generic",
        elements: [],
        title: "Name Template"
      }
    ]
    addDoc(collection(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates`), {
      template_type: "generic",
      user_id: this.authService.curretUserSig()?.uid,
      title: "Name Template"
    }).then((res) => {
      this.baseTemplates[this.baseTemplates.length - 1].id = res.id
    })
  }
}
