import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first,map, catchError} from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { ProductRes, Product } from '../_models/product';
import { UserRes, User } from '../_models/user';
import {  ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
@Component({
  selector: 'app-deliever-history',
  templateUrl: './deliever-history.component.html',
  styleUrls: ['./deliever-history.component.css']
})
export class DelieverHistoryComponent implements OnInit {
	ProductsData:any[];
  products=ProductRes;
  private subProduct: Subscription ;
  user : User ;
  done = false ; 
  error : string ;

  selectedData = [{ id: 1}, { id: 2}, { id: 3}, { id: 4}, { id: 5}, { id: 6 }];
  
  constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private api: ApiService,
        private authenticationService: AuthenticationService) {
        this.user = this.authenticationService.userValue;
     }

  ngOnInit(): void {
  	this.getDeliveredOrdersOfUser();
  }

  getDeliveredOrdersOfUser(){
    const myObserver = {
      next: (res) => {
      this.ProductsData= res.data;
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subProduct = this.api.getDeliveredOrdersOfUser(this.user.id)
      .subscribe(myObserver)
  }


  recurCart(id : string){

    this.done = true;
    this.api.recurringCart(id)
      .pipe(first())
            .subscribe(
                data => {
                  // this.loading = false;
                  // this.submitted = false;
                  if(data.success){
                    console.log("success");
                     setTimeout(() => this.done = false, 5000);
                    //this.router.navigate(['/login'])
                  }else{
                    this.error = data.message;
                  }
                    //console.log('data', data);
                    //this.router.navigate([this.returnUrl]);
                },
                error => {
                  console.log("error");
                    // this.error = error;
                    // this.loading = false;
                });

  }
  
}
