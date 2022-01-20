import { OwlOptions } from 'ngx-owl-carousel-o';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first,map, catchError} from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import {  ApiService } from '../_services/api.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
	   Data:any;
     private subData : Subscription;
     ImageMiscData ; 
     private subMiscImage : Subscription;
     TestimonialImage : any =[];
     TeamImage : any = [];
	  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [ '<i class="fa-arrow-left fa-2x"></i>', '<i class="fa-arrow-right fa-2x"></i>' ],
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

  constructor(private route: ActivatedRoute,
        private router: Router,
        private api: ApiService,
      ) { }

  ngOnInit(): void {
    this.getData();
    this.getImageByCategory("About Top")
  }

  getData(){
    const myObserver = {
      next: (res) => {
      this.Data= res.data;
      console.log(this.Data); 
      for (let i = 0; i < this.Data.data.length; i++) {
         if(this.Data.data[i].category==="testimonial"){
          this.TestimonialImage.push(this.Data.data[i]);
         }
    }
    for (let i = 0; i < this.Data.data.length; i++) {
         if(this.Data.data[i].category==="team"){
          this.TeamImage.push(this.Data.data[i]);
         }
    }
    console.log(this.TeamImage)
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subData = this.api.getData()
      .subscribe(myObserver)
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
    this.subMiscImage = this.api.getImageByCategory("About Top")
      .subscribe(myObserver)
  }
}
