import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
 
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    environment = {
  production: false,
  apiUrl: 'http://localhost:9001'
};
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   // const authToken = this.authenticationService.getToken();
   //      req = req.clone({
   //          setHeaders: {
   //              Authorization: "Bearer " + authToken
   //          }
   //      });
   const user = this.authenticationService.userValue;
        const isLoggedIn = user && user.authdata;
        const isApiUrl = request.url.startsWith(this.environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                //withCredentials: true,
                setHeaders: {
                  Authorization: `Bearer ${user.authdata}`,
                  //'X-CSRF-Token':  `${user.csrf_token}`,
                  'Content-Type': 'application/json'
                },
                //mode: 'no-cors' // the most important option
            });
        }else{
          request = request.clone({
            setHeaders: {
              'Content-Type': 'application/json'
            }
          });
        }
    return next.handle(request);
  }
}
