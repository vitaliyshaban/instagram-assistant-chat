
import * as express from "express";
// import * as bodyParser from "body-parser";
import {onRequest} from "firebase-functions/v1/https";
import {Watch} from "./instagramm/services";

const app = express();
// app.use(bodyParser.json());

const VERIFY_TOKEN =
// eslint-disable-next-line max-len
"IGQWRQTHNnN3hfSDZA0Mlo0b0xLUVhqMC1jTGF6NlMzQ1JoaDhPNURtUmpFMV95NmJZAU2Y5YTRVR1VtZAkV4MjJZAODFYbHFsa0llWHgyT3RGTWFJSHRmeE9pT0ZAwRnRIRjBHdExpSDVkazRORmVONzBLNFROR2pRZAm8ZD";

// app.post("/webhook", (req, res) => {
//   const body = req.body;

//   // Верификация вебхука
//   if (req.query["hub.challenge"]) {
//     return res.status(200).send(req.query["hub.challenge"]);
//   }

//   // Обработка данных вебхука
//   console.log("Received webhook:", body);
//   // Здесь добавьте вашу логику обработки

//   return res.status(200).send("EVENT_RECEIVED");
// });

app.get("/webhook", (req, res) => {
  console.log("cooll!!!");
  // const body = req.body;
  // Верификация вебхука
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});
app.post("/webhook", (req, res) => {
  const body = req.body;
  console.log(body);
  const watch = new Watch(body);
  watch.start();
  res.status(200);
});
exports.instagramWebhook = onRequest(app);

// export const webhook = onRequest((request, response) => {
//   if (request.method === "GET") {
//     const mode = request.query["hub.mode"];
//     const token = request.query["hub.verify_token"];
//     const challenge = request.query["hub.challenge"];
//     if (mode && token === VERIFY_TOKEN) {
//       response.status(200).send(challenge);
//     } else {
//       response.sendStatus(403);
//     }
//   } else if (request.method === "POST") {
//     const body = request.body;
//     const watch = new Watch(body);
//     watch.start();
//     response.sendStatus(200);
//   } else {
//     response.sendStatus(403);
//   }
// });

