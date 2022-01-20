import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first,map, catchError} from 'rxjs/operators';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductRes, Product } from '../_models/product';
import { UserRes, User } from '../_models/user';
import {  ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-ourproducts',
  templateUrl: './ourproducts.component.html',
  styleUrls: ['./ourproducts.component.css']
})

export class OurproductsComponent implements OnInit {
  ProductsData:any[];
  private subProduct: Subscription ;
  private save: Subscription ;
  cartForm: FormGroup;
  productId = new FormControl('');
  obj : any ;
  quantity = 1;
  user: User;
  error : string;
  done  = false ;
  ImageMiscData : any = [];
  private subMiscImage : Subscription ;
  constructor(private route: ActivatedRoute,
        private router: Router,
        private api: ApiService,
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService)  {
           this.user = this.authenticationService.userValue;
         }

  ngOnInit(): void {
    this.cartForm = this.formBuilder.group({
      productId: this.productId
    });
  	const myObserver = {
      next: (res) => this.ProductsData= res.data ,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subProduct = this.api.getProducts()
      .subscribe(myObserver)
    this.getImageByCategory();
  }		

  getImageByCategory(){
    const myObserver = {
      next: (res) => {
      this.ImageMiscData=res.data;
      console.log(this.ImageMiscData);
      this.ImageMiscData.sort((a, b) => a.index - b.index);
      console.log(this.ImageMiscData);
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };
    this.subMiscImage = this.api.getImageByCategory("Our Product Banner")
      .subscribe(myObserver)


  }
  get f() { return this.cartForm.controls; }

  addToCart(id : string){
  this.done = true;
    console.log(id);
    this.obj ={
      id : id,
      quantity : this.quantity,
      owner : this.authenticationService.userValue.id
    }
    console.log(this.obj.productId);
    this.api.cart(this.obj)
      .pipe(first())
            .subscribe(
                data => {
                  // this.loading = false;
                  // this.submitted = false;
                  if(data.success){
                    console.log("success");
                     setTimeout(() => this.done = false, 5000);
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
  BlankForm(){
    this.cartForm.reset();
  }

}
