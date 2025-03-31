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
  selector: 'app-dialog-add-text',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, ReactiveFormsModule],
  templateUrl: './dialog-add-text.component.html',
  styleUrl: './dialog-add-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAddTextComponent {
  readonly dialogRef = inject(MatDialogRef<DialogAddTextComponent>);
  data = inject(MAT_DIALOG_DATA);
  
  form: FormGroup = new FormGroup({});
  
  constructor(private formBuilder: FormBuilder,) {}

  ngOnInit() {
    console.log(this.data);
    this.form = this.formBuilder.group({
      title: new FormControl(this.data ? this.data.form.title : '', [
        Validators.required
      ]),
      text: new FormControl(this.data ? this.data.form.text : '', [
        Validators.required
      ]),
    });
  }
  add() {
    console.log(this.form.value);
    if(this.form.invalid) return
    this.dialogRef.close({
      ...this.form.value
    });
  }
}
