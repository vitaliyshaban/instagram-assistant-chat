import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IElement } from '../../base-templates.component';
import { CommonModule } from '@angular/common';
import { addDoc, collection, deleteDoc, doc, Firestore, updateDoc, writeBatch } from '@angular/fire/firestore';
import { ref, Storage, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { AuthService } from '../../../../../services/auth.service';
import { FormControl, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';

import { AddButtonComponent } from './add-button/add-button.component';
import {
  MatDialog,
} from '@angular/material/dialog';
import { DialogAddTextComponent } from './dialog-add-text/dialog-add-text.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    AddButtonComponent,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  authService = inject(AuthService);
  firestore: Firestore = inject(Firestore);
  storage: Storage = inject(Storage);

  readonly dialog = inject(MatDialog);

  @Input() index: number = 0;
  @Input() card: IElement = {} as IElement;
  @Input() templateId: string = '';
  @Output() remove = new EventEmitter<void>();
  edit: boolean = false;

  form: FormGroup = new FormGroup({});

  selectedFile: File | null = null;
  downloadURL: string | null = null;
  imageUrl = '';
  constructor(private formBuilder: FormBuilder,) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: new FormControl(this.card.title, [
        Validators.required
      ]),
      subtitle: new FormControl(this.card.subtitle, [
        Validators.required
      ]),
    });
    if(!this.card.id) {
      this.edit = true;
    }
  }
  editCard() {
    this.edit = true;
  }
  deleteCard() {
    deleteDoc(doc(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates/${this.templateId}/elements`, `${this.card.id}`)).then((res) => {
      this.remove.emit();
      const fileRef = ref(this.storage, this.card.image_url);

      deleteObject(fileRef)
        .then(() => {
          console.log('Файл успешно удален!');
        })
        .catch((error) => {
          console.error('Ошибка при удалении файла: ', error);
        });
    });
  }
  addCard() {
    if(this.form.invalid) return
    addDoc(collection(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates/${this.templateId}/elements`), {
      title: this.form.value.title,
      subtitle: this.form.value.subtitle,
      image_url: this.card.image_url,
      order: this.index
    }).then((res) => {
      this.card.id = res.id;
      this.saveImage();
      if(!this.card.buttons?.length && !res.id) return
      const batch = writeBatch(this.firestore);
      const collectionRef = collection(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates/${this.templateId}/elements/${res.id}/buttons`);
      this.card.buttons?.forEach((item, i) => {
        const docRef = doc(collectionRef);
        batch.set(docRef, {...item, order: i});
      });
      batch.commit().then(() => {
        this.edit = false;
      }).catch((error) => {
        console.error('Ошибка добавления документов: ', error);
      });
    })
  }
  saveCard() {
    if(this.form.invalid) return
    updateDoc(doc(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates/${this.templateId}/elements`, `${this.card.id}`), {
      title: this.form.value.title,
      subtitle: this.form.value.subtitle,
      image_url: this.card.image_url
    }).then((res) => {
      this.edit = false;
    })
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.imageUrl = URL.createObjectURL(event.target.files[0]);
    this.saveImage();
  }
  saveImage() {
    if (this.selectedFile && this.card.id) {
      const filePath = `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates/${this.templateId}/elements/${this.card.id}.${this.getFileExtension(this.selectedFile.name)}`;
      const storageRef = ref(this.storage, filePath);
      uploadBytesResumable(storageRef, this.selectedFile).then((res) => {
        getDownloadURL(res.ref).then((url) => {
          this.card.image_url = url;
          this.saveCard();
        })
      });
    }
  }
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }
  editButton(id: string) {
    const dialogRef = this.dialog.open(AddButtonComponent, {
      width: '100%',
      maxWidth: '450px',
      data: {
        form: this.card.buttons?.find(btn => btn.id === id)
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        updateDoc(doc(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates/${this.templateId}/elements/${this.card.id}/buttons`, `${result.id}`), result).then((res) => {
          this.card.buttons!.find(btn => btn.id === result.id)!.title = result.title;
          this.card.buttons!.find(btn => btn.id === result.id)!.url = result.url;
        })
      }
    });
  }
  deleteButton(id: string) {
    deleteDoc(doc(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates/${this.templateId}/elements/${this.card.id}/buttons`, `${id}`)).then((res) => {
      this.card.buttons = this.card.buttons!.filter(btn => btn.id !== id);
    })
  }
  addButton(type: string) {
    const dialogRef = this.dialog.open(AddButtonComponent, {
      width: '100%',
      maxWidth: '450px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.card = {
          ...this.card,
          buttons: [
            ...(this.card.buttons! ? this.card.buttons! : []),
            {
              type: 'web_url',
              title: result.title,
              url: result.url
            }
          ]
        }
        if(!this.card.id) return;
        addDoc(collection(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates/${this.templateId}/elements/${this.card.id}/buttons`), {
          type: 'web_url',
          title: result.title,
          url: result.url,
          order: this.card.buttons!.length - 1
        }).then((res) => {
          // console.log(res)
        })
      }
    });
    
  }
  addTextTemplate(type: string) {
    const dialogRef = this.dialog.open(DialogAddTextComponent, {
      width: '100%',
      maxWidth: '450px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reText = result.text.replace(/\n\n/g, '\\n\\n').replace(/\n/g, '\\n');
        addDoc(collection(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/text_templates`), {
          title: result.title,
          text: reText
        }).then((res) => {
          if(!this.card.id) return;
          addDoc(collection(this.firestore, `users_instagram/${this.authService.curretUserSig()?.uid}/base_templates/${this.templateId}/elements/${this.card.id}/buttons`), {
            type: 'postback',
            title: result.title,
            payload: `text_templates-${res.id}`,
            order: this.card.buttons!.length
          }).then((res) => {
            this.card = {
              ...this.card,
              buttons: [
                ...(this.card.buttons! ? this.card.buttons! : []),
                {
                  type: 'postback',
                  title: result.title,
                  payload: `text_templates-${res.id}`,
                }
              ]
            }
          })
        })
      }
    });
  }
}
