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
  selector: 'app-admin-deliever',
  templateUrl: './admin-deliever.component.html',
  styleUrls: ['./admin-deliever.component.css']
})
export class AdminDelieverComponent implements OnInit {
	OrdersData:any[];
	private subOrder: Subscription ;
  constructor(private route: ActivatedRoute,
        private router: Router,
        private api: ApiService,
        private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  	this.getDelieveredOrders();
  }
  getDelieveredOrders(){
  	const myObserver = {
      next: (res) => {
      this.OrdersData= res.data;

      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subOrder = this.api.getDelieveredOrders()
      .subscribe(myObserver)
  }

}
