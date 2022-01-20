import { Component, AfterViewChecked, ChangeDetectorRef,} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AuthenticationService } from './_services/authentication.service';
import { User, Role } from './_models';
  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'veg';
  user: User ;
  collapsed = true   ;
  constructor(
      private router: Router,
      private changeDetector: ChangeDetectorRef,
      public authenticationService : AuthenticationService
  ) {
      this.authenticationService.user.subscribe(x => this.user = x);
     
  }

  

 ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }
  get isAdmin() {
    return this.user && this.user.isAdmin === Role.owner;
  }
  
  get isEndUser() {
    return this.user && this.user.isAdmin === Role.endUser;
  }
  
 
  logout() {
      this.authenticationService.logout();
  }
}
