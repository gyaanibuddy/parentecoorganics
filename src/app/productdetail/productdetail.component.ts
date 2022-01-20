import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { first,map, catchError, filter} from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { ProductRes, Product } from '../_models/product';
import { UserRes, User } from '../_models/user';
import {  ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {
	ProductsData : any;
  ReviewData : any ;
 private subProduct: Subscription ;
  private subReview : Subscription ;
	id ;
  //previousUrl: string;
  done  = false;
  obj :any ;
  static reload = 1;
  error : string ;
  quantity : number = 1;
  user : User ;
  starRating = 0; 
  reviewForm : FormGroup;
  n : number;
  mySubscription: any;
  previousUrl: string = null;
    currentUrl: string = null;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private authenticationService: AuthenticationService) { 
      this.user = this.authenticationService.userValue;
       this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
           this.previousUrl = this.currentUrl;
           this.currentUrl = event.url;
           console.log(this.previousUrl,this.currentUrl)
           console.log(document.referrer)
        });
    
      
  }
 // currentUrl = this.router.url;

  ngOnInit(): void {

    this.reviewForm = this.formBuilder.group({
      comment: [''],
    });

    this.id=this.route.snapshot.paramMap.get('pid');
  	const myObserver = {
      next: (res) => {
        this.ProductsData= res.data;
        console.log(this.ProductsData);
        this.ProductsData.sort((a, b) => a.index - b.index);
        } ,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };
    this.subProduct = this.api.getProductdetail(this.id)
    .subscribe(myObserver)

    this.getReviewsOfProduct();
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
}
  refresh(): void {
   
  console.log(document.referrer," ", window.location," ",history);
  if(ProductdetailComponent.reload==1){
      window.location.reload();
      ProductdetailComponent.reload++;
  }
   console.log(ProductdetailComponent.reload); 
}

  ngOnDestroy() {
  if (this.mySubscription) {
    this.mySubscription.unsubscribe();
  }
}
   get f() { return this.reviewForm.controls; }

   getReviewsOfProduct(){
      const myObserver = {
      next: (res) => this.ReviewData= res.data ,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };
    this.subReview = this.api.getReviewsOfProduct(this.id)
    .subscribe(myObserver)
   }

    numSequence(num: string): Array<number> {
      this.n  = Number(num);
    return Array(this.n);
  }

  addToCart(id : string){
  this.done = true;
    this.obj ={
      id : id,
      quantity : this.quantity,
      owner : this.authenticationService.userValue.id
    }
    this.api.cart(this.obj)
    .pipe(first())
    .subscribe(
    data => {
      if(data.success){
        console.log("success");
         setTimeout(() => this.done = false, 5000);
        //this.router.navigate(['/login'])
      }else{
        this.error = data.message;
      }
    },
    error => {
      console.log("error");
    });
  }

  

   saveReview(){
    this.obj ={
      product : this.id,
      rating : this.starRating,
      owner : this.authenticationService.userValue.id,
      comment : this.f.comment.value
    }
    this.api.saveReview(this.obj)
    .pipe(first())
    .subscribe(
    data => {
      if(data.success){
        console.log("success");
        this.getReviewsOfProduct();
        //this.router.navigate(['/login'])
      }else{
        this.error = data.message;
      }
    },
    error => {
      console.log("error");
    });
  }
}
// this.router.routeReuseStrategy.shouldReuseRoute = function () {
//         return false;
//       };
//     this.mySubscription = this.router.events.subscribe((event) => {
//       if (event instanceof NavigationEnd) {
//         // Trick the Router into believing it's last link wasn't previously loaded
//         this.router.navigated = false;
//       }
//     });