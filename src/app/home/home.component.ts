import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first,map, catchError} from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { ProductRes, Product } from '../_models/product';
import { UserRes, User } from '../_models/user';
import {  ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images = ["assets/images/bg_1.jpg","assets/images/bg_2.jpg"];
	loading = false ;
	error = false ;
  type: string ;
  done= false ;
  ProductsData:any[];
  products=ProductRes;
  cartForm: FormGroup;
  Obj: Product ;
  submitted = false ;
  checked=true;
  message:string;
  message1:string;
  private subProduct: Subscription ;
  private save: Subscription ;
  productId = new FormControl('');
  obj : any ;
  quantity = 1;
  user: User;
   show = false;

  close() {
    this.show = false;
  }
  private ngUnsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private api: ApiService,
        private authenticationService: AuthenticationService) { 
      
    this.user = this.authenticationService.userValue;
    
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [ '<i class="fa-chevron-left fa-2x"></i>', '<i class="fa-chevron-right fa-2x"></i>' ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }


   ngOnInit(): void {

    this.cartForm = this.formBuilder.group({
      productId: this.productId
    });

  	const myObserver = {
      next: (res) => {
      this.ProductsData= res.data;
      this.ProductsData.slice(0,3);
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subProduct = this.api.getHomeProducts()
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


                        this.type = "done";
                        this.show = true ;
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
