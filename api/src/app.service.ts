import { Inject, Injectable } from '@nestjs/common';
import { IBaseTemplate, IEntry, IMessaging } from './services/interfaces';
import { Firestore } from '@google-cloud/firestore';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  object: string;
  entry: IEntry[];
  messaging: IMessaging[];
  constructor(
    @Inject('FIRESTORE') private firestore: Firestore,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  getStart(data: any) {
    const { object, entry } = data;
    this.object = object;
    this.entry = entry;
    this.messaging = this.entry[0].messaging;

    if (this.object === 'instagram') {
      this.messaging.forEach(async (mes) => {
        // if (mes.message && mes.message?.text === 'ping') {
        //   this.postback(mes);
        // }
        // return;
        if (mes.postback) {
          console.log('postback');
          this.postback(mes);
        } else if (mes.message) {
          console.log('message');
        } else if (mes.read) {
          console.log('read');
        }
      });
    }
  }
  payloadSplit(payload: string) {
    // return 'base_templates-vG3cBcp3b4lAgW7dkcVj'.split('-');
    return payload.split('-');
  }
  async postback(mes: IMessaging) {
    const [d, c] = this.payloadSplit(mes.postback.payload);
    const userRef = this.firestore.collection('users_instagram');
    const queryRef = userRef.where('api.user_id', '==', mes.recipient.id);
    const users = await queryRef.get();

    users.forEach(async (doc) => {
      if (d === 'base_templates') {
        this.baseTemplates(doc, d, c, mes);
      } else if (d === 'text_templates') {
        this.textTemplates(doc, d, c, mes);
      }
    });
  }
  async textTemplates(
    doc: FirebaseFirestore.QueryDocumentSnapshot,
    d: string,
    c: string,
    mes: IMessaging,
  ) {
    const textTemplateSnapshot = await this.firestore
      .collection(`users_instagram/${doc.id}/${d}`)
      .doc(`${c}`)
      .get();

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `https://graph.facebook.com/v13.0/me/messages?access_token=${this.configService.get<string>('PAGE_ACCESS_TOKEN')}&recipient={"id":"${mes.sender.id}"}&message={"text":"${textTemplateSnapshot.data()?.text}"}`,
        ),
      );
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  async baseTemplates(
    doc: FirebaseFirestore.QueryDocumentSnapshot,
    d: string,
    c: string,
    mes: IMessaging,
  ) {
    const templateSnapshot = await this.firestore
      .collection(`users_instagram/${doc.id}/${d}`)
      .doc(`${c}`)
      .get();

    const elements: unknown[] = [];
    const elementsSnapshot = await this.firestore
      .collection(`users_instagram/${doc.id}/${d}/${c}/elements`)
      .orderBy('order', 'asc')
      .get();

    for (const element of elementsSnapshot.docs) {
      const id = element.id;
      const buttons: unknown[] = [];
      const buttonsSnapshot = await this.firestore
        .collection(
          `users_instagram/${doc.id}/${d}/${c}/elements/${id}/buttons`,
        )
        .orderBy('order', 'asc')
        .get();

      for (const btn of buttonsSnapshot.docs) {
        console.log(btn);
        buttons.push({
          ...btn.data(),
        });
      }

      elements.push({
        ...element.data(),
        buttons: buttons,
      });
    }

    const template: IBaseTemplate = {
      recipient: {
        id: mes.sender.id,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: templateSnapshot.data()?.template_type,
            elements: [...elements],
          },
        },
      },
    };

    console.log(template);
    console.log(template.message.attachment.payload.elements);
    const API_URL = `https://graph.facebook.com/v13.0/me/messages?access_token=${this.configService.get<string>('PAGE_ACCESS_TOKEN')}`;
    try {
      const response = await firstValueFrom(
        this.httpService.post(API_URL, template),
      );
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
