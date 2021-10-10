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
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.component.html',
  styleUrls: ['./orderhistory.component.css']
})
export class OrderhistoryComponent implements OnInit {
	ProductsData:any[];
  products=ProductRes;
  private subProduct: Subscription ;
  user : User ;
  error : string ;
  constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private api: ApiService,
        private authenticationService: AuthenticationService) {
  		
  		 this.user = this.authenticationService.userValue;
    
   }

  ngOnInit(): void {
  	this.getPlacedOrderByUser();
  }
  getPlacedOrderByUser(){
    const myObserver = {
      next: (res) => {
      this.ProductsData= res.data;
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subProduct = this.api.getPlacedOrderByUser(this.user.id)
      .subscribe(myObserver)
  }
  
  cancelOrder(id:string){
    this.api.cancelOrder(id)
    .subscribe(
      result=> {
        if(result.success){
            // this.message1="Delete done"
            // this.done = true ;
            // this.type="info";
           this.getPlacedOrderByUser(); 
            
        }
      },
      error => {
        this.error = error;
      }
    )
  }



}
