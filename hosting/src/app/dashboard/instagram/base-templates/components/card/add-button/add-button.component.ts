import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, ReactiveFormsModule],
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddButtonComponent {
  readonly dialogRef = inject(MatDialogRef<AddButtonComponent>);
  data = inject(MAT_DIALOG_DATA);
  
  form: FormGroup = new FormGroup({});
  
  constructor(private formBuilder: FormBuilder,) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: new FormControl(this.data ? this.data.form.title : '', [
        Validators.required
      ]),
      url: new FormControl(this.data ? this.data.form.url : '', [
        Validators.required
      ]),
    });
  }
  add() {
    if(this.form.invalid) return
    this.dialogRef.close({
      ...this.form.value,
      id: this.data ? this.data.form.id : ''
    });
  }
}
