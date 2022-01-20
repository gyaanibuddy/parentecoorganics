import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first,map, catchError} from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { ProductRes, Product } from '../_models/product';
import { UserRes, User } from '../_models/user';
import {  ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { HttpClient } from '@angular/common/http';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
	loading = false ;
	done =false ;
	message : string ;
	message1 : string ;
	type : string ;
	error = false;
	ProductsData:any[];
  CouponData:any;
	productForm:FormGroup;
  couponForm: FormGroup;
	private subProduct: Subscription ;
  private subCoupon: Subscription ;
	obj : any ;
  name : any;
  checked=false;
	private save: Subscription ;
	submitted = false;
  images;
  id;
  data;
  public Editor = ClassicEditor;
  public editorData;
  private ngUnsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,
        private formBuilder: FormBuilder,
        private api: ApiService,
        private authenticationService: AuthenticationService) { }

  ngOnInit(): void {

  	this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''] ,
      price: [''] ,
      image:[''],
      totalStock: [''],
      editId: [''],
      imageId:[''],
      isActive: ['']
     });
    this.couponForm = this.formBuilder.group({
      code: ['', Validators.required],
      amount: [''] ,
      isPercent: [''] ,
      isActive: [''],
      editCoupon:['']
     });
  	this.getProducts();
    this.getCoupons();
  	
  }

   get f() { return this.productForm.controls; }
   get g() { return this.couponForm.controls; }

   public onChange( { editor }: ChangeEvent ) {
        this.data = editor.getData();

        console.log( this.data );
    }

  getProducts(){
  	const myObserver = {
      next: (res) => {
      this.ProductsData= res.data;
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subProduct = this.api.getProductAdmin()
      .subscribe(myObserver)
  }

  getCoupons(){
    const myObserver = {
      next: (res) => {
      this.CouponData= res.data;
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subCoupon = this.api.getCoupons()
      .subscribe(myObserver)
  }

 onSubmit(){

 console.log(this.data);
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.productForm.invalid) {
        this.loading = false;
        return;
    }
    if(this.f.editId.value == "" || this.f.editId.value == null){
    	this.obj = {
    		name :  this.f.name.value,
    		description : this.data,
    		price : this.f.price.value,
    		totalStock : this.f.totalStock.value,
        isActive: this.f.isActive.value
    	}
      this.save = this.api.saveProduct(this.obj)
      .pipe(first())
      .subscribe(
        data => {
          this.submitted = false ;
           this.loading = false;
          if(data.success){
           console.log("saved")
            this.message1="Save done"
            this.done = true ;
            this.type ='info';
            this.BlankForm();
            this.getProducts();
          }else{
             
             this.message = data.err.message ;
             this.loading = false;
             this.error=true;
             this.type = 'danger';
          }
        },
        error => {
          this.loading = false;
          this.error = error;
          this.message = error ;
          this.error=true;
          this.type = 'warning';
        });
    }

    else{
      this.obj = {
        	id: this.f.editId.value,
          name: this.f.name.value,
          description: this.data,
          price: this.f.price.value,
          totalStock : this.f.totalStock.value,
          isActive: this.f.isActive.value,
          image:this.f.image.value
      }
      this.save = this.api.updateProduct(this.obj)
      .subscribe(
        result=> {
          this.BlankForm();
          if(result.success){
            this.loading = false;
            this.message1="Update done"
            this.done = true ;
            this.type='info';
           this.getProducts();
          }
        },
        err => {
          this.error = err;
          this.message = err ;
          this.type = 'warning';
        }
      )

    }
    
  }
  getSingleProduct(id: string){
    this.api.getSingleProduct(id)
    .subscribe(
      result=>{
        if(result){
        console.log(result.data);
           this.editorData = result.data.description;
           this.productForm.setValue({
              name:result.data.name,
              description:result.data.description,
              price:result.data.price,
              totalStock : result.data.totalStock,
              editId:result.data._id,
              isActive: result.data.isActive,
              imageId:'',
              image:"",
            });
        }
      },
      err => {
        console.log("Error");
      }
    )
  }

  selectImage(event, id:string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
      this.id = id;
    }
  }

  onUpload(){
    const formData = new FormData();
    formData.append('file', this.images);

    this.http.post<any>('http://localhost:9001/file', formData).subscribe(
      (res) =>{
        console.log(res);
        console.log(res.filename);
        this.name = {
         image: res.filename
        }
        console.log(this.name);  

    //     this.api.saveImage(this.id, this.name)
    // .pipe(first())
    //   .subscribe(
    //     result => {
    //       console.log(this.name);    
    //       console.log("saved");
    //     },
    //     error => {
    //     });
      } ,
      (err) => console.log(err)
    );
   console.log(this.name);   
}
  
// delete(id:string){
//     this.api.deleteProduct(id)
//     .subscribe(
//       result=> {
//         if(result.success){
//             this.message1="Delete done"
//             this.done = true ;
//             this.type="info";
//            this.getProducts();
            
//         }
//       },
//       error => {
//         this.error = error;
//       }
//     )
//   }

  getSingleProductForImage(id: string){
     this.api.getSingleProduct(id)
    .subscribe(
      result=>{
        if(result){
        console.log(result.data);
           this.productForm.setValue({
              name:result.data.name,
              description:result.data.description,
              price:result.data.price,
              totalStock : result.data.totalStock,
              imageId:result.data._id,
              image:"",
              editId:"",
              isActive: result.data.isActive,
            });
        }
      },
      err => {
        console.log("Error");
      }
    )
  }

  onCoupon(){
    if(this.g.editCoupon.value == "" || this.g.editCoupon.value == null){
       this.obj = {
        code :  this.g.code.value,
        amount : this.g.amount.value,
        isPercent : this.g.isPercent.value,
        isActive: this.g.isActive.value
      }
      this.save = this.api.saveCoupon(this.obj)
      .pipe(first())
      .subscribe(
        data => {
          this.submitted = false ;
           this.loading = false;
          if(data.success){
           console.log("saved")
            this.message1="Save done"
            this.done = true ;
            this.type ='info';
            this.BlankForm();
            this.getCoupons();
          }else{
             
             this.message = data.err.message ;
             this.loading = false;
             this.error=true;
             this.type = 'danger';
          }
        },
        error => {
          this.loading = false;
          this.error = error;
          this.message = error ;
          this.error=true;
          this.type = 'warning';
        });
    }

    else{
       this.obj = {
        code :  this.g.code.value,
        amount : this.g.amount.value,
        isPercent : this.g.isPercent.value,
        isActive: this.g.isActive.value,
        id: this.g.editCoupon.value,
      }
      
      this.save = this.api.updateCoupon(this.obj)
      .subscribe(
        result=> {
          this.BlankForm();
          if(result.success){
            this.loading = false;
            this.message1="Update done"
            this.done = true ;
            this.type='info';
           this.getCoupons();
          }
        },
        err => {
          this.error = err;
          this.message = err ;
          this.type = 'warning';
        }
      )

    }
    
  }
  getSingleCoupon(id: string){
    this.api.getSingleCoupon(id)
    .subscribe(
      result=>{
        if(result){
        console.log(result.data);
           this.couponForm.setValue({
              code:result.data.code,
              amount:result.data.amount,
              editCoupon:result.data._id,
              isActive: result.data.isActive,
              isPercent: result.data.isPercent
            });
        }
      },
      err => {
        console.log("Error");
      }
    )
  }

 // onCoupon(){
 //  console.log("COupon");
 //      this.obj = {
 //        code :  this.g.code.value,
 //        amount : this.g.amount.value,
 //        isPercent : this.g.isPercent.value,
 //        isActive: this.g.isActive.value
 //      }
 //      this.save = this.api.saveCoupon(this.obj)
 //      .pipe(first())
 //      .subscribe(
 //        data => {
 //          this.submitted = false ;
 //           this.loading = false;
 //          if(data.success){
 //           console.log("saved")
 //            this.message1="Save done"
 //            this.done = true ;
 //            this.type ='info';
 //            this.BlankForm();
 //            this.getProducts();
 //          }else{
 //             console.log("error")
 //             this.message = data.err.message ;
 //             this.loading = false;
 //             this.error=true;
 //             this.type = 'danger';
 //          }
 //        },
 //        error => {
 //          console.log("eee");
 //          this.loading = false;
 //          this.error = error;
 //          this.message = error ;
 //          this.error=true;
 //          this.type = 'warning';
 //        });
    
 //  }

   BlankForm(){
    this.productForm.reset();
    this.couponForm.reset();
  }

   ngOnDestroy(): void{
    if(this.save){
      this.save.unsubscribe();
    }
    if(this.subProduct){
      this.subProduct.unsubscribe();
    }
  }
}
