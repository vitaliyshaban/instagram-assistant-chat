import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { IBaseTemplate, IButton, IElement } from '../../base-templates.component';
import { AuthService } from '../../../../../services/auth.service';
import { collection, Firestore, getDocs, orderBy, query } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { timer } from 'rxjs';

@Component({
  selector: 'app-base-template',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent
  ],
  templateUrl: './base-template.component.html',
  styleUrl: './base-template.component.scss'
})
export class BaseTemplateComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  authService = inject(AuthService);
  firestore: Firestore = inject(Firestore);
  
  @Input() data: IBaseTemplate = {} as IBaseTemplate;  // Входной параметр

  ngOnInit() {
    this.authService.user$.subscribe(async (user: User) => {
      const ref = collection(this.firestore, `users_instagram/${user.uid}/base_templates/${this.data.id}/elements`);
      getDocs(query(ref, orderBy("order", "asc"))).then((res) => {
        res.docs.forEach((doc) => {
          const btnRef = collection(this.firestore, `users_instagram/${user.uid}/base_templates/${this.data.id}/elements/${doc.id}/buttons`);
          getDocs(query(btnRef, orderBy("order", "asc"))).then((res) => {
            const buttons: IButton[] = [];
            res.docs.forEach((doc) => {
              buttons.push({
                ...doc.data(),
                id: doc.id
              })
            })
            this.data.elements?.push({
              ...doc.data(),
              id: doc.id,
              buttons: buttons
            })  
          })
        })
      })
    })
  }
  addCard() {
    this.data = {
      ...this.data,
      elements: [
        ...this.data.elements!,
        {
          title: '',
          image_url: '',
          subtitle: '',
          buttons: []
        }
      ]
    }
    timer(100).subscribe(() => {
      this.scrollContainer.nativeElement.scrollTo({ left: this.scrollContainer.nativeElement.scrollWidth, behavior: 'smooth' });
    });
  }
  deleteCard(index: number) {
    this.data.elements?.splice(index, 1);
  }
}
