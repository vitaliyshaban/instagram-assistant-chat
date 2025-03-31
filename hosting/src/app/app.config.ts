import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { getFirestore, provideFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { getStorage, provideStorage, connectStorageEmulator } from '@angular/fire/storage';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp({
      apiKey: environment.firebase.apiKey,
      authDomain: environment.firebase.authDomain,
      projectId: environment.firebase.projectId,
      storageBucket: environment.firebase.storageBucket,
      messagingSenderId: environment.firebase.messagingSenderId,
      appId: environment.firebase.appId,
      measurementId: environment.firebase.measurementId
    })),
    provideAuth(() => {
      const auth = getAuth();
      if (!environment.production) connectAuthEmulator(auth, `http://${environment.firebase.EMULATOR_PUBLIC_HOST}:9099`)
      return (auth);
    }), provideAnimationsAsync(),
    provideFirestore(() => {
      const store = getFirestore();
      if (!environment.production) connectFirestoreEmulator(store, environment.firebase.EMULATOR_PUBLIC_HOST, 8080);
      return store;
    }),
    provideStorage(() => {
      const storage = getStorage();
      if (!environment.production) connectStorageEmulator(storage, environment.firebase.EMULATOR_PUBLIC_HOST, 9199);
      return storage;
    }),
  ]
};
