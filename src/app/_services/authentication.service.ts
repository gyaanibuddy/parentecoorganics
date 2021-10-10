import { Injectable } from '@angular/core';
import { HttpClient , HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User, UserRes, Role} from '../_models/user';
import { Observable, of , BehaviorSubject} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    environment = {
        apiUrl: '/api'
    };
     private user1: User ;
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    //This will be used for registration
    registration(username: string, password: string, firstName: string, lastName: string, contactNo: string, addr1: string, addr2 :string , city : string , state :string ,postalCode :string){
      let options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };
      let params = {'firstName' : firstName ,
      'lastName' : lastName,
      'username': username ,
      'password': password,
      'contactNo':  contactNo,
      'addr1' : addr1,
      'addr2' : addr2,
      'city' : city ,
      'state' : state,
      'postalCode' : postalCode
      }
      return this.http.post<any>(`${this.environment.apiUrl}/saveUser`, params )
          .pipe(map(user=> {
              if(user.success){
                  this.user1 = {
                       username: user.data.username,
                        password: password,
                        id: user.data._id,
                        firstName: user.data.firstName ,
                        contactNo: user.data.contactNo,
                        addr1: user.data.addr1,
                        addr2 : user.data.addr2,
                        city : user.data.city,
                        state : user.data.state,
                        postalCode : user.data.postalCode,
                        lastName: user.data.lastName,
                        isAdmin: user.data.isAdmin,
                        authdata: user.token,/*window.btoa(user.data.username + ':' + password)*/
                     };
                    //localStorage.setItem('user', JSON.stringify(this.user1));
//                     this.userSubject.next(this.user1);
                    return user;
                }else{
                    return user ;
                }
          }))
    }

    login(username: string, password: string) {
console.log(username);
//       let headers = new HttpHeaders();
//       headers = headers.append('Content-Type','application/json');

      let options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };
      let params = {'username' : username , 'password' : password }


      return this.http.post<any>(`${this.environment.apiUrl}/login`, params )
      //return this.http.get<any>(`${environment.apiUrl}/session/token` )
        .pipe(map(user => {

                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                //user.authdata = window.btoa(username + ':' + password);
                console.log(user);
                if(user.success){
                    this.user1 = {
                         username: user.data.username,
                        password: password,
                        id : user.data._id ,
                        firstName: user.data.firstName ,
                        lastName: user.data.lastName,
                        contactNo : user.data.contactNo,
                        addr1: user.data.addr1,
                        addr2: user.data.addr2,
                        city: user.data.city,
                        isAdmin: user.data.isAdmin,
                        state: user.data.state,
                        postalCode : user.data.postalCode,
                        //csrf_token: user.csrf_token,
                        //logout_token: user.logout_token ,
                        //profileUrl: user.current_user.profileUrl,
                        authdata:user.token,
                   };

                    console.log(this.user1);
                    localStorage.setItem('user', JSON.stringify(this.user1));
                    this.userSubject.next(this.user1);
                    return user;
                }else{
                    return user ;
                }
            }));
    }
     logout() {
        //TODO need to work out on closing of session
      localStorage.removeItem('user');
      this.userSubject.next(null);
      this.router.navigate(['/login']);
      console.log('logout');
    }
/*
   login(emailAndPassword): void {
    this.userService.login(emailAndPassword).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        const decodedUser = this.decodeUserFromToken(res.token);
        this.setCurrentUser(decodedUser);
        this.loggedIn = true;
        this.router.navigate(['/']);
      },
      error => this.toast.setMessage('invalid email or password!', 'danger')
    );
  }
}
   logout(): void {
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.isAdmin = false;
    this.currentUser = new User();
    this.router.navigate(['/']);
  }

  decodeUserFromToken(token): object {
    return this.jwtHelper.decodeToken(token).user;
  }

  setCurrentUser(decodedUser): void {
    this.loggedIn = true;
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.role = decodedUser.role;
    this.isAdmin = decodedUser.role === 'admin';
    delete decodedUser.role;
  }*/
}

