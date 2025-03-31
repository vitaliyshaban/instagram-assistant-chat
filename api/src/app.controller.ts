import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get('instagramWebhook')
  verifyTioken(@Req() req: Request, @Res() res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === this.configService.get<string>('PAGE_ACCESS_TOKEN')) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
  @Post('instagramWebhook')
  postMassage(@Req() req: Request) {
    console.log(req.body);
    this.appService.getStart(req.body);
  }
}
