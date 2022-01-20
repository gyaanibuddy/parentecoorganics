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
  loading = false ;
	error = false ;
  type: string ;
  done= false ;
  ProductsData:any[];
  Data:any;
  products=ProductRes;
  cartForm: FormGroup;
  Obj: Product ;
  submitted = false ;
  checked=true;
  message:string;
  message1:string;
  private subProduct: Subscription;
  private subData : Subscription;
  private save: Subscription ;
  productId = new FormControl('');
  obj : any ;
  quantity = 1;
  user: User;
   show = false;
  ImageMiscData: any;
  TestimonialImage : any =[];
  HomeImage : any = [];
  private subMiscImage : Subscription;
  category = "Home Carousel";
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
    window.history.pushState({preurl : window.location.href} ,null);
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
    this.getData();
  	const myObserver = {
      next: (res) => {
      this.ProductsData= res.data;
      this.ProductsData.slice(0,3);
      console.log(this.ProductsData)
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subProduct = this.api.getHomeProducts()
      .subscribe(myObserver)

    this.getImageByCategory(this.category);
    this.getHomeImage();
    //this.getTestimonial();
    //this.getImageByCategory("Testimonial");
  }

  getImageByCategory(category:string){
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
    this.subMiscImage = this.api.getImageByCategory("Home Carousel")
      .subscribe(myObserver)


  }

  getHomeImage(){
     const myObserver = {
      next: (res) => {
      this.HomeImage=res.data;
      
      this.HomeImage.sort((a, b) => a.index - b.index);
      console.log(this.HomeImage)
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };
    this.subMiscImage = this.api.getImageByCategory("Home Image")
      .subscribe(myObserver)

  }

  get f() { return this.cartForm.controls; }

  getData(){
    const myObserver = {
      next: (res) => {
      this.Data= res.data;
      console.log(this.Data.data)
      for (let i = 0; i < this.Data.data.length; i++) {
         if(this.Data.data[i].category==="testimonial"){
          this.TestimonialImage.push(this.Data.data[i]);
         }
    }
      
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subData = this.api.getData()
      .subscribe(myObserver)
  }

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
