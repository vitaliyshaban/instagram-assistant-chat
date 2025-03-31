import { Component, ComponentFactoryResolver, ElementRef, inject, Input, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { InstagramService } from '../../../../services/instagram.service';

@Component({
  selector: 'app-instagram-template',
  standalone: true,
  imports: [],
  templateUrl: './instagram-template.component.html',
  styleUrl: './instagram-template.component.scss'
})
export class InstagramTemplateComponent {
  authService = inject(AuthService);
  instagramService = inject(InstagramService);

  @Input() component!: any;
  @Input() componentData!: any;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  // @ViewChild('dynamicComponentContainerWrapper', { static: true }) containerWrapper!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    if (this.component) {
      this.container.clear();  // Очищаем контейнер перед вставкой нового компонента
      const componentRef = this.container.createComponent(this.component);  // Создаём компонент динамически
      const element = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
      // Добавляем класс к компоненту
      this.renderer.addClass(element, 'contents');
      (componentRef.instance as any).data = this.componentData;
      (componentRef.instance as any).data = this.componentData;
    }
  }
}
