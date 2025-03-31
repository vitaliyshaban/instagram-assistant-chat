import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { User } from '@angular/fire/auth';
import { IInstaUser } from '../interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class InstagramService {
  authService = inject(AuthService);
  curretInstaUserSig = signal<IInstaUser | null | undefined>(undefined);
  
  constructor(private http: HttpClient, private firestoreService: FirestoreService) {}

  getData(url_api: string, token: string): Observable<any> {
    console.info(`connecting to ${url_api}/v20.0/me?fields=id,name,picture{url}&access_token=${token}`)
    return this.http.get(`${url_api}/v20.0/me?fields=id,name,picture{url}&access_token=${token}`).pipe(
      catchError(this.handleError) // Обрабатываем ошибки
    );
  }

  // Функция для обработки ошибок
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Ошибка на стороне клиента
      console.error(error.error.message);
    } else {
      // Ошибка на стороне сервера
      console.error(
        `Server error: ${error.status}, ` + `ansver: ${error.error}`
      );
    }
    // Вернуть пользовательское сообщение об ошибке
    return throwError(() => new Error(error.message));
  }
  setUser(user: IInstaUser) {
    this.curretInstaUserSig.set(user); // Обновляем сигнал
    console.log(this.curretInstaUserSig())
  }
  getUser() {
    return this.authService.user$.pipe(
      switchMap((user: User) => {
        // Преобразуем promise в observable
        return from(
          this.firestoreService.getCollectionsQuery('config_fb', { user_uid: user.uid })
        ).pipe(
          // Когда получим конфигурацию, выполняем HTTP запрос
          switchMap((config) => {
            const url_api = config.docs[0].data()['url_api'];
            const token = config.docs[0].data()['token'];
            console.log(token);
            // Делаем HTTP запрос с токеном и URL API
            return this.http.get<any>(`${url_api}/v20.0/me?fields=id,name,picture{url}&access_token=${token}`);
          })
        );
      })
    );
  }
}
