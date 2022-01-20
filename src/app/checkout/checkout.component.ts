import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first,map, catchError} from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { ProductRes, Product } from '../_models/product';
import { UserRes, User } from '../_models/user';
import {  ApiService } from '../_services/api.service';

import { WindowRefService } from '../_services/window-ref.service';
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
  done1 = false;
  done2 = false;
  templateForm : FormGroup;
  couponForm : FormGroup ; 
  address = ["Primary Address","Secondary Address"];
  selectedAddress: any = "";
  payment = ['paypal', 'card', 'UPI'];
  private subProduct: Subscription ;
  id ;
  public static currentId: string;
  public static intervalId : any[]=[];
  obj : any ;
  obj1 : any;
  obj2 : any;
  addressForm: FormGroup ;
  total : number ;
  disabled = true;
  PaymentData : any ; 
  options:any;
  private subPayment: Subscription ;
  private static sender: CheckoutComponent;
  constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private api: ApiService,
        private authenticationService: AuthenticationService,
        private winRef: WindowRefService) { 
  	 this.user = this.authenticationService.userValue;
     
  }

  ngOnInit(): void {
    //console.log(this.user.id);
    this.id=this.route.snapshot.paramMap.get('oid');
    const myObserver = {
      next: (res) => {
        this.OrderData= res;
        this.total = this.OrderData.total;
        if(this.OrderData.data[0].owner.primaryAddress.addr1==""){
          this.selectedAddress="Secondary Address"
          console.log(this.selectedAddress)
        }
        this.couponForm.setValue({code: '', total: this.total/100});
        const myObserver1 = {
          next: (res) => {
            this.PaymentData= res.data;
            console.log(this.PaymentData)
            } ,
          err: (err) => {console.log(err)},
          complete: () => console.log('complete fetching data')
        };

        this.subPayment = this.api.razorpay(this.total)
          .subscribe(myObserver1)
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
      contactNo: ['']
    });

     this.couponForm = this.formBuilder.group({
      code: [''],
      total:['']
    });

    this.couponForm.controls['total'].disable();
    
  //this.getPayment();
  }

  setValue() {
    console.log(this.OrderData.total);
  }

  get f() { return this.addressForm.controls; }

  get g() { return this.couponForm.controls; }

  getPayment(){
    // const myObserver = {
    //   next: (res) => {
    //     this.PaymentData= res.data;
    //     console.log(this.PaymentData)
    //     } ,
    //   err: (err) => {console.log(err)},
    //   complete: () => console.log('complete fetching data')
    // };

    // this.subPayment = this.api.razorpay(18000)
    //   .subscribe(myObserver)
   }

  updateAddress(){
    console.log(this.selectedAddress)
    this.setValue();
    if(this.selectedAddress == "Primary Address"){
      this.addressForm.setValue({
        addr1:this.OrderData.data[0].owner.primaryAddress.addr1,
        addr2: this.OrderData.data[0].owner.primaryAddress.addr2,
        city : this.OrderData.data[0].owner.primaryAddress.city,
        state: this.OrderData.data[0].owner.primaryAddress.state,
        postalCode :this.OrderData.data[0].owner.primaryAddress.postalCode,
        contactNo : this.OrderData.data[0].owner.contactNo
      });
      this.addressForm.disable()
    }
    if(this.selectedAddress == "Secondary Address"){
      this.addressForm.reset();
      this.addressForm.enable();
    }
  }

  updatePrimaryAddress(){
    this.obj2 = {
      id : this.user.id,
      addr1 : this.f.addr1.value,
      addr2 : this.f.addr2.value,
      city : this.f.city.value,
      state : this.f.state.value,
      postalCode : this.f.postalCode.value,
    }
    this.api.updatePrimary(this.obj2)
    .pipe(first())
    .subscribe(
    data => {
      // this.loading = false;
      // this.submitted = false;
      if(data.success){
        console.log("success");
      this.done= true;
        
      }else{
        this.error = data.message;
      }
        
    },
    error => {
      console.log("error");
        // this.error = error;
        // this.loading = false;
    });
  }

  

   placeOrder(){
  
    if(this.selectedAddress==""){
      this.done2  = true;
        setTimeout(() => this.done2 = false, 3000);
    }
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
        addr1 : this.f.addr1.value+" "+CheckoutComponent.currentId,
        addr2 : this.f.addr2.value,
        city : this.f.city.value,
        state : this.f.state.value,
        postalCode : this.f.postalCode.value,
        contactNo : this.f.contactNo.value
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
        
      }else{
        this.error = data.message;
      }
        
    },
    error => {
      console.log("error");
        // this.error = error;
        // this.loading = false;
    });
  }

  loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });

  }

  showRazorpay() {
 
    const res = this.loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }//rzp_test_6SnVpkNnCk4OP1  rzp_live_rHjUd9gnzkXnOD
   
    console.log(this.total);
    var total=JSON.stringify(this.total);
    const options = {
      key: "rzp_live_rHjUd9gnzkXnOD",
      currency: "INR",
      amount:this.total,
      order_id:this.PaymentData.id,
      name: "Payment",
      description: "Parent Eco Organics",
      image: "",
      handler: function (response) {
        console.log(response)
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
       // CheckoutComponent.placeOrder();
        CheckoutComponent.currentId = response.razorpay_order_id;
        alert("Transaction successful"+" "+CheckoutComponent.currentId);
      },
      prefill: {
        name: "Ekta",
        email: "Ekta@gmail.com",
        phone_number: "9899999999",
      },
    };
    console.log(options);
    const paymentObject = this.winRef.nativeWindow.Razorpay(options);
    paymentObject.open();
    console.log(paymentObject);

    this.capture();
  }

  capture(){
    console.log(CheckoutComponent.currentId)
    if(CheckoutComponent.sender===undefined){
      CheckoutComponent.sender = this;
    }
    if(CheckoutComponent.currentId !== undefined){
      let sender = this;
      console.log("Placed");
      CheckoutComponent.sender.placeOrder();
      CheckoutComponent.sender.router.navigate(['/placeHistory'])
      CheckoutComponent.sender = undefined;
    CheckoutComponent.currentId = undefined;

    CheckoutComponent.intervalId.forEach(intId => 
      clearInterval(intId));
    }
    CheckoutComponent.intervalId.push(setInterval(this.capture, 500));
  }

  
}




