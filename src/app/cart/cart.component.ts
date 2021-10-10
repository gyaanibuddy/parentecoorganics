import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first,map, catchError} from 'rxjs/operators';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProductRes, Product } from '../_models/product';
import { UserRes, User } from '../_models/user';
import {  ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';


import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';  

declare var jQuery: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  CartData:any[];
  private subCart: Subscription ;
  private save: Subscription ;
  user : User ;
  obj : any ;
  error : string ;
  cartForm : FormGroup;
  quantity = new FormControl('');

     closeResult: string;  

  constructor(
  private modalService: NgbModal,
  	private route: ActivatedRoute,
        private router: Router,
        private api: ApiService,
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService) {
          this.obj={
      user:this.authenticationService.userValue,
    }
         }

  ngOnInit(): void {
  	 this.user = this.authenticationService.userValue ;
  	     console.log(this.authenticationService.userValue.id);
       this.cartForm = this.formBuilder.group({
      quantity: this.quantity
    });
     this.getCart();
  }

    getCart(){
      const myObserver = {
      next: (res) => this.CartData= res.data ,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

     this.subCart = this.api.getCart(this.user.id)
       .subscribe(myObserver)
    }



   open(content, order , product) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
      console.log(order);
      console.log(product);
      if(`${result}` == "save"){
         this.removeProduct(order, product);
        console.log("Ekta");
      }
     else
     {
        console.log("Vardhman");
      }
    

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



    removeProduct(order : string, product : string){
    console.log(order);
    this.obj ={
      id : order,
      pid : product
    }
    console.log(this.obj.id);
    this.api.removeFromCart(this.obj)
      .pipe(first())
            .subscribe(
                data => {
                  // this.loading = false;
                  // this.submitted = false;
                  if(data.success){
                    console.log("success");
                    this.getCart();
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

    plus(quantity : any, id : string){
    console.log(id);
    quantity++;
    console.log(quantity);
    this.obj ={
      id : id,
      quantity : quantity,
      owner : this.authenticationService.userValue.id
    }
    console.log(this.obj.id);
    this.api.cart(this.obj)
      .pipe(first())
            .subscribe(
                data => {
                  // this.loading = false;
                  // this.submitted = false;
                  if(data.success){
                    console.log("success");
                    this.getCart();
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

  minus(quantity : any, id : string){
    console.log(id);
    if(quantity>=2){
      quantity--;
    }
    
    console.log(quantity);
    this.obj ={
      id : id,
      quantity : quantity,
      owner : this.authenticationService.userValue.id
    }
    console.log(this.obj.id);
    this.api.cart(this.obj)
      .pipe(first())
            .subscribe(
                data => {
                  // this.loading = false;
                  // this.submitted = false;
                  if(data.success){
                    console.log("success");
                    this.getCart();
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

  checkout(){
    console.log(this.CartData[0]._id);
     this.api.checkout(this.CartData[0]._id)
      .pipe(first())
            .subscribe(
                data => {
                  if(data.success){
                  console.log("success")
                    this.router.navigate(['/checkout',  this.CartData[0]._id] )
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
