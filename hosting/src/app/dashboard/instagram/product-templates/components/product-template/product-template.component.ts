import { Component, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { IElement, IProductTemplate } from '../../product-templates.component';

@Component({
  selector: 'app-product-template',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent
  ],
  templateUrl: './product-template.component.html',
  styleUrl: './product-template.component.scss'
})
export class ProductTemplateComponent {
  @Input() data: IElement[] = [] as IElement[];  // Входной параметр

  ngOnInit() {
    console.log(this.data);
  }
}
