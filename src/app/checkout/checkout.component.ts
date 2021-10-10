import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first,map, catchError} from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { ProductRes, Product } from '../_models/product';
import { UserRes, User } from '../_models/user';
import {  ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  user: User ; 
  error = false;
  error1 : string ;
  OrderData:any;
  done = false;
  templateForm : FormGroup;
  couponForm : FormGroup ; 
  address = ["Primary Address","Secondary Address"];
  selectedAddress: any;
  payment = ['paypal', 'card', 'UPI'];
  private subProduct: Subscription ;
  id ;
  obj : any ;
  obj1 : any;
  addressForm: FormGroup ;
  total : any ;
  constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private api: ApiService,
        private authenticationService: AuthenticationService) { 
  	 this.user = this.authenticationService.userValue;
     
  }

  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get('oid');
    console.log(this.id);
    const myObserver = {
      next: (res) => {
        this.OrderData= res;
      this.total = this.OrderData.total;
       console.log(this.total);
        this.couponForm.setValue({code: '', total: this.total});
        } ,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subProduct = this.api.getTotal(this.id)
      .subscribe(myObserver)


    this.addressForm = this.formBuilder.group({
      addr1: [''],
      addr2: [''],
      city:  [''],
      state: [''],
      postalCode: [''],
    });

     this.couponForm = this.formBuilder.group({
      code: [''],
      total:['']
    });
  }

   setValue() {
    console.log(this.OrderData.total);
  }

   get f() { return this.addressForm.controls; }

   get g() { return this.couponForm.controls; }

  updateAddress(){
     this.setValue();
    if(this.selectedAddress == "Primary Address"){
        this.addressForm.setValue({
              addr1:this.OrderData.data[0].owner.primaryAddress.addr1,
              addr2: this.OrderData.data[0].owner.primaryAddress.addr2,
              city : this.OrderData.data[0].owner.primaryAddress.city,
              state: this.OrderData.data[0].owner.primaryAddress.state,
              postalCode :this.OrderData.data[0].owner.primaryAddress.postalCode
            });
         this.addressForm.disable()
    }
    if(this.selectedAddress == "Secondary Address"){
       this.addressForm.reset();
      this.addressForm.enable();
    }
  }

  applyCoupon(){
    
      this.obj1= {
        total : this.OrderData.total,
        code : this.g.code.value,
        id: this.id
      }
    
    this.api.applyCoupon(this.obj1)
    .pipe(first())
    .subscribe(
    data => {
      // this.loading = false;
      // this.submitted = false;
      if(data.success){
        console.log("success");
        console.log(data.total);
       
        this.g.total.setValue(data.total);
        //this.router.navigate(['/login'])
      }else{
        this.error = true;
         this.error1 = "Invalid coupon code";
       setTimeout(() => this.error = false, 3000);
        console.log(data.success);
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


  placeOrder(){
    if(this.selectedAddress == "Primary Address"){
      this.obj = {
        id : this.id,
        delieveryAddress :"primary"
      }
    }
    if(this.selectedAddress == "Secondary Address"){
      this.obj = {
        id : this.id,
        delieveryAddress : "secondary",
        addr1 : this.f.addr1.value,
        addr2 : this.f.addr2.value,
        city : this.f.city.value,
        state : this.f.state.value,
        postalCode : this.f.postalCode.value,
      }
    }
    this.api.placeOrder(this.obj)
    .pipe(first())
    .subscribe(
    data => {
      // this.loading = false;
      // this.submitted = false;
      if(data.success){
        console.log("success");
      this.done= true;
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
