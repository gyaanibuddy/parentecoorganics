import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first,map, catchError} from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { ProductRes, Product } from '../_models/product';
import { UserRes, User } from '../_models/user';
import {  ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';

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
  obj :any ;
  error : string ;
  quantity : number = 1;
  user : User ;
  starRating = 0; 
  reviewForm : FormGroup;
n : number;
  constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private api: ApiService,
        private authenticationService: AuthenticationService) { 
         this.user = this.authenticationService.userValue;
        
         }
  currentUrl = this.router.url;

  ngOnInit(): void {

    this.reviewForm = this.formBuilder.group({
      comment: [''],
    });

    this.id=this.route.snapshot.paramMap.get('pid');
  	const myObserver = {
      next: (res) => this.ProductsData= res.data ,
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
