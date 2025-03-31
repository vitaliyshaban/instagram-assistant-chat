import { Component, Input } from '@angular/core';
import { IElement } from '../../product-templates.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() card: IElement = {} as IElement;  // Входной параметр
  ngOnInit() {
    console.log(this.card);
  }
}
