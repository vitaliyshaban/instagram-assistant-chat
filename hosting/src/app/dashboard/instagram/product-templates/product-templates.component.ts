import { Component } from '@angular/core';
import { InstagramTemplateComponent } from '../components/instagram-template/instagram-template.component';
import { CommonModule } from '@angular/common';
import { ProductTemplateComponent } from './components/product-template/product-template.component';

export interface IProductTemplate {
  template_type?: string;
  elements?: IElement[];
}
export interface IElement {
  title?: string;
  image_url?: string;
  subtitle?: string;
  buttons?: IButton[];
}
export interface IButton {
  type?: string;
  url?: string;
  title?: string;
  payload?: string;
}


@Component({
  selector: 'app-product-templates',
  standalone: true,
  imports: [
    CommonModule,
    InstagramTemplateComponent,
    ProductTemplateComponent
  ],
  templateUrl: './product-templates.component.html',
  styleUrl: './product-templates.component.scss'
})
export class ProductTemplatesComponent {
  productTemplateComponent = ProductTemplateComponent;
  productTemplateIndex = 0;

  productTemplates = [
    {
      template_type: "generic",
      elements: [
        {
          title: "Разовая персональная тренировка",
          image_url: "https://firebasestorage.googleapis.com/v0/b/alesiafitness-firebase.appspot.com/o/1.jpg?alt=media&token=162ddf2f-8e98-4b53-b355-572dd0fe236e",
          subtitle: "Разовая тренировка",
          buttons: [
            {
              type: "web_url",
              url: "https://alesia.fitness",
              title: "Узнать цены",
            },
            {
              type: "postback",
              title: "Получить консультацию",
              payload: "CONSULTATION_SERVICE_1",
            },
          ],
        },
        {
          title: "Месячное сопровождение",
          image_url: "https://firebasestorage.googleapis.com/v0/b/alesiafitness-firebase.appspot.com/o/8.jpg?alt=media&token=ac757f4d-561b-4cc4-8153-2cec8dc5a9f5",
          subtitle: "8 занятий",
          buttons: [
            {
              type: "web_url",
              url: "https://alesia.fitness",
              title: "Узнать цены",
            },
            {
              type: "postback",
              title: "Получить консультацию",
              payload: "CONSULTATION_SERVICE_2",
            },
          ],
        },
        {
          title: "Месячное сопровождение",
          image_url: "https://firebasestorage.googleapis.com/v0/b/alesiafitness-firebase.appspot.com/o/12.jpg?alt=media&token=b10e872d-3e23-4e28-a225-e34afd832d9d",
          subtitle: "12 занятий",
          buttons: [
            {
              type: "web_url",
              url: "https://alesia.fitness",
              title: "Узнать цены",
            },
            {
              type: "postback",
              title: "Получить консультацию",
              payload: "CONSULTATION_SERVICE_2",
            },
          ],
        },
      ],
    }
  ]

  ngOnInit() {

  }
}
