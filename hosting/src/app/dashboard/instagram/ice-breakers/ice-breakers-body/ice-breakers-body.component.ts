import { Component, Input } from '@angular/core';
import { IceBreakerComponent } from '../components/ice-breaker/ice-breaker.component';
import { IIceBreakers } from '../ice-breakers.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ice-breakers-body',
  standalone: true,
  imports: [
    CommonModule,
    IceBreakerComponent
  ],
  templateUrl: './ice-breakers-body.component.html',
  styleUrl: './ice-breakers-body.component.scss'
})
export class IceBreakersBodyComponent {
  @Input() data: IIceBreakers[] = [] as IIceBreakers[];

  // ngOnInit() {
  //   console.log(this.data);
  // }
}
