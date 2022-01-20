import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first,map, catchError} from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { ProductRes, Product } from '../_models/product';
import { UserRes, User } from '../_models/user';
import {  ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-admin-history',
  templateUrl: './admin-history.component.html',
  styleUrls: ['./admin-history.component.css']
})
export class AdminHistoryComponent implements OnInit {
	OrdersData:any[];
	private subOrder: Subscription ;
  statusForm: FormGroup  ;
  error : string;
  obj : any;
  status = ["process","package","onway"];


    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 5, name: 'Klaipėda'}
    ];
    
   
  

    selectedStatus: any;

  constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private api: ApiService,
        private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  	this.getPlacedOrders();
  //this.getDelieveredOrders();
  console.log(this.selectedStatus);
  this.statusForm = this.formBuilder.group({
      stat: ['', Validators.required],
    });
  }

  getPlacedOrders(){
  	const myObserver = {
      next: (res) => {
        this.OrdersData= res.data;
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };
    this.subOrder = this.api.getPlacedOrders()
      .subscribe(myObserver)
  }

  

  updateStatus(id : string){
    console.log("Update");
    console.log(this.selectedStatus);
    this.obj = {
      id : id,
      status : this.selectedStatus
    }
    this.api.updateStatus(this.obj)
    .pipe(first())
    .subscribe(
      data => {
        // this.loading = false;
        // this.submitted = false;
        if(data.success){
          console.log("success");
          this.getPlacedOrders();
        }else{
          this.error = data.message;
        }
      },
      error => {
        console.log("error");
          // this.error = error;
          // this.loading = false;
      }
    );
  }

  delieverOrder(id : string){
    console.log(id);
    this.api.delieverOrder(id)
    .pipe(first())
    .subscribe(
      data => {
        // this.loading = false;
        // this.submitted = false;
        if(data.success){
          console.log("success");
          this.getPlacedOrders();
        }else{
          this.error = data.message;
        }
      },
      error => {
        console.log("error");
          // this.error = error;
          // this.loading = false;
      }
    );
  }
}
