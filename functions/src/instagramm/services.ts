import {initializeApp} from "firebase-admin/app";
import {
  getFirestore,
} from "firebase-admin/firestore";

import {
  IBody, IEntry, IMessaging, IPostback, IRecipient, ISender,
} from "./interfaces";
import axios from "axios";

// eslint-disable-next-line max-len
const PAGE_ACCESS_TOKEN = "EAAQmakQXRRIBOyxwIKbi2vY8GL2P5So1ZA9dIxjKZBS9A19xyMycgxmzz9L2mtFsXdFnfZB7ltGjzfZAotJhCrHDmMKOoONnXIMBOetClgZBsff6q2HPybYFNXSZAueDgM6ZAlrWaYzyBYDZApOZCH0jWStEo9WoLOk8uyFBRwjPqq9UKKxQKH7szbNeoDfnSxgZAZBg5SpFxTXcGmtxQHc";

initializeApp();

const db = getFirestore();
/*
  sender - отправитель (id),
  recipient - получатель (id),
  text - сообщение отправителя,
  mid - uid сообщения
 */

export class ServiceIntagram {
  object: string;
  entry: IEntry[];
  URL = "https://graph.facebook.com";

  constructor(body: IBody) {
    const {object, entry} = body;
    this.object = object;
    this.entry = entry;
  }

  getBody() {
    console.log(
      {
        platform: this.object,
        entry: this.entry,
      }
    );
    return this.object;
  }
}
/*
  postback - действия пользователя (нажатие кнопки)
  text - текст сообщения
  read - текст отправителя
 */
export class Messages extends ServiceIntagram {
  messaging: IMessaging[] = [];

  constructor(body: IBody) {
    super(body);
    this.messaging = this.entry[0].messaging;
  }
  get() {
    return this.messaging;
  }
}

export class Watch extends Messages {
  constructor(body: IBody) {
    super(body);
  }
  start() {
    if (this.object === "instagram") {
      this.messaging.forEach(async (mes) => {
        if (mes.message && mes.message?.text === "ping") {
          console.log(mes);
          const postback = new Postback(mes);
          postback.send();
        }
        return;
        if (mes.postback) {
          console.log("postback");
          const postback = new Postback(mes);
          postback.send();
        } else if (mes.message) {
          console.log("message");
        } else if (mes.read) {
          console.log("read");
        }
      });
    }
  }
}

export class Message {
  sender: ISender;
  recipient: IRecipient;

  constructor(mes: IMessaging) {
    this.sender = mes.sender;
    this.recipient = mes.recipient;
  }
}

export class GetUser {
  id: string;
  constructor(recipient: IRecipient) {
    this.id = recipient.id;
  }
  async get() {
    console.log("connect");
    const userRef = db.collection("users_instagram");
    const queryRef = userRef.where("api.user_id", "==", this.id);
    console.log("connect get");
    console.log(queryRef.get());
    console.log("connect end");
    return queryRef.get();
  }
}

export class Postback extends Message {
  postback: IPostback;

  constructor(mes: IMessaging) {
    super(mes);
    this.postback = mes.postback as IPostback;
  }
  payloadSplit() {
    return "base_templates-vG3cBcp3b4lAgW7dkcVj".split("-");
    // return this.postback.payload.split("-");
  }
  async send() {
    const [d, c] = this.payloadSplit();
    console.log("start");
    const userRef = db.collection("users_instagram");
    const queryRef = userRef.where("api.user_id", "==", this.recipient.id);
    const users = await queryRef.get();
    console.log("end");
    console.log(users);

    users.forEach(async (doc) => {
      console.log(doc.data());
      if (d === "base_templates") {
        const templateSnapshot = await db.collection(
          `users_instagram/${doc.id}/${d}`
        ).doc(`${c}`).get();

        const elements: unknown[] = [];
        const elementsSnapshot = await db.collection(
          `users_instagram/${doc.id}/${d}/${c}/elements`
        ).orderBy("order", "asc").get();

        for (const element of elementsSnapshot.docs) {
          const id = element.id;
          const buttons: unknown[] = [];
          const buttonsSnapshot = await db.collection(
            `users_instagram/${doc.id}/${d}/${c}/elements/${id}/buttons`
          ).orderBy("order", "asc").get();

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

        console.log(elements);
        const template: unknown = {
          recipient: {
            id: this.sender.id,
          },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: templateSnapshot.data()?.template_type,
                elements: [...elements],
              },
            },
          },
        };

        console.log(template);
        const API_URL = `https://graph.facebook.com/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
        try {
          const response = await axios.post(API_URL, {
            recipient: {id: this.sender.id},
            message: {text: "hi"},
          }, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("Message sent successfully:", response.data);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      } else if (d === "text_templates") {
        const textTemplateSnapshot = await db.collection(
          `users_instagram/${doc.id}/${d}`
        ).doc(`${c}`).get();

        try {
          const response = await axios.post(
            `https://graph.facebook.com/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}&recipient={"id":"${this.sender.id}"}&message={"text":"${textTemplateSnapshot.data()?.text}"}`
          );
          console.log("Message sent successfully:", response.data);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    });
  }
  // async send() {
  //   const [d, c] = this.payloadSplit();
  //   // const user = new GetUser(this.recipient);
  //   // const users = await user.get();
  //   const userRef = db.collection("users_instagram");
  //   const queryRef = userRef.where("api.user_id", "==", this.recipient.id);
  //   const users = await queryRef.get();
  //   console.log(users);
  //   users.forEach((doc) => {
  //     console.log(doc.data());
  //     switch (d) {
  //     case "base_templates":
  //       db.collection(
  //         `users_instagram/${doc.id}/${d}`
  //       ).doc(`${c}`).get().then(async (templateSnapshot) => {
  //         const elements: unknown[] = [];
  //         const elementsSnapshot = await db.collection(
  //           `users_instagram/${doc.id}/${d}/${c}/elements`
  //         ).orderBy("order", "asc").get();

  //         for (const element of elementsSnapshot.docs) {
  //           const id = element.id;
  //           const buttons: unknown[] = [];
  //           const buttonsSnapshot = await db.collection(
  //             `users_instagram/${doc.id}/${d}/${c}/elements/${id}/buttons`
  //           ).orderBy("order", "asc").get();

  //           buttonsSnapshot.forEach((btn) => {
  //             console.log(btn);
  //             buttons.push({
  //               ...btn.data(),
  //             });
  //           });

  //           elements.push({
  //             ...element.data(),
  //             buttons: buttons,
  //           });
  //         }
  //         console.log(elements);
  //         const template = {
  //           recipient: {
  //             id: this.sender.id,
  //           },
  //           message: {
  //             attachment: {
  //               type: "template",
  //               payload: {
  //                 template_type: templateSnapshot.data()?.template_type,
  //                 elements: [
  //                   ...elements,
  //                 ],
  //               },
  //             },
  //           },
  //         };
  //         console.log(template);
  //         const API_URL = `https://graph.facebook.com/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  //         try {
  //           const response = await axios.post(API_URL, {
  //             recipient: {id: this.sender.id},
  //             message: {text: "hi"},
  //           }, {
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //           });
  //           console.log("Message sent successfully:", response.data);
  //         } catch (error) {
  //           console.error(
  //             "Error sending message:",
  //             error
  //           );
  //         }
  //       });
  //       break;
  //     case "text_templates":
  //       db.collection(
  //         `users_instagram/${doc.id}/${d}`
  //       ).doc(`${c}`).get().then(async (templateSnapshot) => {
  //         try {
  //           const response = await axios.post(`https://graph.facebook.com/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}&recipient={"id":"${this.sender.id}"}&message={"text":"${templateSnapshot.data()?.text}"}`);
  //           console.log("Message sent successfully:", response.data);
  //         } catch (error) {
  //           console.error(
  //             "Error sending message:",
  //             error
  //           );
  //         }
  //       });
  //       break;
  //     default:
  //       break;
  //     }
  //   });
  // }
}


export class PingPong extends Messages {
  constructor(body: IBody) {
    super(body);
  }
  async start() {
    if (this.object === "instagram") {
      this.messaging.forEach(async (mes) => {
        if (mes.message && mes.message?.text === "ping") {
          const messageData = {
            recipient: {id: mes.sender.id},
            message: {text: "pong"},
          };
          try {
            await axios.post(
              `${this.URL}/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
              messageData);
            console.log();
          } catch (error: unknown) {
            console.error(
              "Error sending message:",
              error
            );
          }
        } else {
          console.log(mes);
        }
      });
    }
  }
}

export class BaseTemplate extends Messages {
  constructor(body: IBody) {
    super(body);
  }
  async start() {
    if (this.object === "instagram") {
      this.messaging.forEach(async (mes) => {
        if (mes.message && mes.message?.text === "ping") {
          const messageData = {
            recipient: {
              id: mes.sender.id,
            },
            message: {
              attachment: {
                type: "template",
                payload: {
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
                    // Добавь больше элементов, если нужно
                  ],
                },
              },
            },
          };

          try {
            await axios.post(
              `${this.URL}/v20.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
              messageData
            );
            console.log();
          } catch (error: unknown) {
            console.error(
              "Error sending message:",
              error
            );
          }
        } else {
          console.log(mes);
        }
      });
    }
  }
}
