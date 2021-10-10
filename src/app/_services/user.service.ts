import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User, UserRes} from '../_models/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
	environment : {
		apiUrl: 'http://localhost:9001'
	}
  constructor(private http: HttpClient) { }

   register(user: User): Observable<User> {
    return this.http.post<User>(`${this.environment.apiUrl}/api/register`, user);
  }
  login(credentials): Observable<any> {
    return this.http.post(`${this.environment.apiUrl}/api/login`, credentials);
  }

}
