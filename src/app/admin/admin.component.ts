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
	productForm:FormGroup;
	private subProduct: Subscription ;
	obj : any ;
  checked=false;
	 private save: Subscription ;
	 submitted = false;
   private ngUnsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private api: ApiService,
        private authenticationService: AuthenticationService) { }

  ngOnInit(): void {

  	this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''] ,
      price: [''] ,
      totalStock: [''],
      editId: [''],
      isActive: ['']
     });
  	this.getProducts();
  	
  }

   get f() { return this.productForm.controls; }

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

 onSubmit(){
 console.log(this.f.isActive.value);
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
    		description : this.f.description.value,
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
    }else{
      this.obj = {
        	id: this.f.editId.value,
          name: this.f.name.value,
          description: this.f.description.value,
          price: this.f.price.value,
          totalStock : this.f.totalStock.value,
          isActive: this.f.isActive.value
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
    //API for gett single Accounts
    // restForm = response
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
              editId:result.data._id,
                  isActive: result.data.isActive,
            });
        }
      },
      err => {
        console.log("Error");
      }
    )
  }

  delete(id:string){
    this.api.deleteProduct(id)
    .subscribe(
      result=> {
        if(result.success){
            this.message1="Delete done"
            this.done = true ;
            this.type="info";
           this.getProducts();
            
        }
      },
      error => {
        this.error = error;
      }
    )
  }

   BlankForm(){
    this.productForm.reset();
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
