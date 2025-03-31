import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { HttpModule } from '@nestjs/axios';
import * as path from 'path';
import { env } from 'process';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'FIRESTORE',
      useFactory: (configService: ConfigService) => {
        // Инициализация Firebase Admin SDK
        const serviceAccountPath = configService.get(
          'FIREBASE_SERVICE_ACCOUNT',
        );
        console.log(process.env.NODE_ENV);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const serviceAccount = require(path.resolve(serviceAccountPath));
        const app = admin.initializeApp({
          // projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
          credential: admin.credential.cert(serviceAccount),
          // databaseURL: 'https://alesiafitness-firebase.firebaseio.com',
        });
        // Подключение к эмулятору Firestore
        const firestore = app.firestore();
        if (env.NODE_ENV !== 'production') {
          console.log('Emulator enabled');
          const firestoreHost = configService.get<string>(
            'FIRESTORE_EMULATOR_HOST',
          );
          if (firestoreHost) {
            firestore.settings({
              host: firestoreHost,
              ssl: false, // SSL должен быть отключен для локального эмулятора
            });
          }
        }
        firestore
          .collection('users_instagram')
          .get()
          .then((res) => {
            console.info(`firebase connected ${res.readTime.toMillis()}`);
          })
          .catch((err) => {
            console.log(err);
          });
        return firestore;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FIRESTORE'],
})
export class AppModule {}
