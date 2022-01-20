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

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

	field = ["homeText","intro1","intro2","vision","mission","team","testimonial"]
	category = ["team","testimonial"]
	selectedField;
	selectedImage;
	dataForm:FormGroup;
	obj : any;
	private save:Subscription;
	Data:any;
	SingleData: any;
  ImageData:any=[""];

	private	subData: Subscription; 
  private subImage: Subscription; 
	id:any;
  index;
  d;

  constructor(private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,
        private formBuilder: FormBuilder,
        private api: ApiService,
        private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  	this.dataForm = this.formBuilder.group({
      value: ['', Validators.required],
      name : [''],
      designation:[''],
      comment:[''],
      editId:['']
     });
  	this.getData();	
    
   //  this.getImageByCategory("Testimonial  ");
    console.log(this.ImageData)
  }

  getData(){
  	const myObserver = {
      next: (res) => {
      this.Data= res.data;
      	this.id = this.Data._id;
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
      this.ImageData= res;
      console.log(this.ImageData);
      // this.ImageProdData.data.sort((a, b) => a.index - b.index);
      },
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };
    this.subImage = this.api.getImageByCategory(category)
      .subscribe(myObserver)
  }

  updateField(){
    console.log(this.selectedField)
    if(this.selectedField==="team"){
       this.getImageByCategory("Team");
    }
    if(this.selectedField=="testimonial"){
      this.getImageByCategory("Testimonial");
    }
  }

   updateImage(){
    //console.log(this.selectedField);
    console.log("Hello")
    console.log(this.selectedImage.name)
    
  }

   get f() { return this.dataForm.controls; }

  onSubmit(){
    if(this.f.editId.value == "" || this.f.editId.value == null){
  	if(this.selectedField != "team" && this.selectedField !="testimonial"){
  	this.obj = {
  		field : this.selectedField,
  		value: this.f.value.value,
  		id:this.id
      }
  }
  else{
  	this.obj={
  		field:"data",
  		name:this.f.name.value,
  		designation:this.f.designation.value,
  		comment:this.f.comment.value,
  		category:this.selectedField,
  		id:this.id,
      image:this.selectedImage.name
  	}
  }
   console.log(this.obj)   
      this.save = this.api.updateData(this.obj)
      .subscribe(
        result=> {
          
          if(result.success){
           console.log("save")
           this.BlankForm();
           this.getData();
          }
          else{
          	console.log("Problem")
          }
        },
        err => {
        	console.log("err")
        }
      )
    }else{
      this.Data.data[this.index].name = this.f.name.value;
      this.Data.data[this.index].designation = this.f.designation.value;
      this.Data.data[this.index].comment = this.f.comment.value;
      this.Data.data[this.index].image = this.selectedImage.name;
      this.save = this.api.updateTeam(this.Data)
      .subscribe(
        result=> {
          if(result.success){
           console.log("save")
           this.BlankForm();
           this.getData();
          
          }
          else{
            console.log("Problem")
          }
        },
        err => {
          console.log("err")
        }
      )
    }
  }

   BlankForm(){
    this.dataForm.reset();
   
  }

  getSingleData(index : number){
    this.index = index;
  		this.selectedField=this.Data.data[index].category;
  		this.dataForm.setValue({
              value:"",
              name:this.Data.data[index].name,
              designation : this.Data.data[index].designation,
              comment:this.Data.data[index].comment,
              editId:this.Data._id
            });
      
	}


}