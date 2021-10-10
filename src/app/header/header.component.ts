import { Component, OnInit } from '@angular/core';
import {  AfterViewChecked, ChangeDetectorRef,} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../_services/authentication.service';
import { User, Role } from '../_models';
  
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor( private router: Router,
      private changeDetector: ChangeDetectorRef,
      public authenticationService : AuthenticationService) {
       this.authenticationService.user.subscribe(x => this.user = x);
      }
  	 title = 'veg';
  user: User ;
  collapsed = false ;
  ngOnInit(): void {
  }
  	ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }
  get isAdmin() {
    return this.user && this.user.isAdmin === Role.owner;
  }
  
  get isEndUser() {
    console.log("true");
    return this.user && this.user.isAdmin === Role.endUser;
  }
  
 
  logout() {
      this.authenticationService.logout();
  }
}
