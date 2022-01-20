import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Role, User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { ToastComponent } from '../toast/toast.component';
import { HttpClientModule } from '@angular/common/http';
import { SocialAuthService } from 'angularx-social-login';
import {SocialUser, GoogleLoginProvider} from 'angularx-social-login';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
  loading = false;
    submitted = false;
    returnUrl: string;
    error = false;
    user: User ;
    user1:SocialUser;
    message : string;
     username = new FormControl('', [
    Validators.email,
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(10)
  ]);
  
  constructor(private authService: SocialAuthService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
         public toast: ToastComponent
        ) { 
          console.log(this.authenticationService.userValue);
        // redirect to home if already logged in
      if(this.authenticationService.userValue){  
        if(this.authenticationService.userValue.isAdmin == 'owner'){
          console.log("Admin");
          this.router.navigate(['/']);
        }else{
          this.router.navigate(['/login']);
        }
      }  
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) =>{
    this.user1 = user;
    console.log(this.user1);
    this.authenticationService.registration(this.user1.email,"",this.user1.firstName, this.user1.lastName, "",  "", "", "","","")
    .pipe(first())
    .subscribe(
      data => {
        this.authenticationService.login(this.user1.email, "")
        .pipe(first())
        .subscribe(
          data => {
            this.submitted = false;
            this.loading = false;
            if(data.success){
                console.log("Success")
                  this.router.navigate([''])
                
            }else{
              console.log("Else")
                 
            }
          },
          error => {
              this.error = error;
              this.loading = false;
               setTimeout(() => this.error = false, 500);
          });
          //}else{
            console.log("REgister")
           // this.error = data.message;
          //}
        },
        error => {
            console.log(error)
        });
    })
      // if(this.user1){
      //   this.router.navigate(['']);
      // }
    this.user = this.authenticationService.userValue ;
    this.loginForm = this.formBuilder.group({
      username: this.username,
      password: this.password
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';     
  }

  setClassEmail(): object {
    return { 'has-danger': !this.username.pristine && !this.username.valid };
  }

  setClassPassword(): object {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }

  signInwithGoogle() : any{
    console.log('Success')
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
    .pipe(first())
    .subscribe(
      data => {
          this.submitted = false;
          this.loading = false;
          if(data.success){
              if(data.data.isAdmin == 'owner'){
                this.router.navigate(['']);
              }else{
                this.router.navigate(['']);
              }
          }else{
              this.error = data.message;
              this.loading = false;
          }
      },
      error => {
        this.error = error;
        this.loading = false;
         setTimeout(() => this.error = false, 500);
      });
  }
  // login(): void {
  //   this.auth.login(this.loginForm.value);
  // }
}