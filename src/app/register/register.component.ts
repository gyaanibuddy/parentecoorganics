import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	registration: FormGroup ;
	loading = false ;
	submitted = false;
  returnUrl: string;		
  error = '';
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  	this.registration = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName : ['', Validators.required],
        username: ['',Validators.required],
        addr1: ['', Validators.required],
        addr2: [''],
        city:  ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        password: ['', Validators.required],
        rePassword: ['',Validators.required],
        contactNo: ['', Validators.required],
      },
      {validator: this.checkIfMatchingPasswords('password', 'rePassword')}
      );
  }
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
          passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
      else {
      console.log("Not match");
          return passwordConfirmationInput.setErrors(null);
      }
    }
  }

   get f() { return this.registration.controls; }
    onSubmit(){
      console.log("Success");
         this.submitted = true;
      // stop here if form is invalid
        if (this.registration.invalid) {
        console.log("Invalid");
            return;
        }
        this.loading = true;
        this.authenticationService.registration(
                this.f.username.value,
                this.f.password.value,
                this.f.firstName.value, 
                this.f.lastName.value, 
                this.f.contactNo.value, 
                this.f.addr1.value, 
                this.f.addr2.value, 
                this.f.city.value,
                this.f.state.value,
                this.f.postalCode.value,
             
            )
            .pipe(first())
            .subscribe(
                data => {
                  this.loading = false;
                  this.submitted = false;
                  if(data.success){
                  console.log("Done");
                    this.router.navigate(['/login'])
                  }else{
                    this.error = data.message;
                  }
                    //console.log('data', data);
                    //this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }

}
