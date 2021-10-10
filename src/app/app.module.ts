import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BasicAuthInterceptor, ErrorInterceptor } from './_helpers';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { UserService } from './_services/user.service';
import { AuthenticationService } from './_services/authentication.service';
import { AuthGuardGuard } from './_helpers/auth-guard.guard';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { ToastComponent } from './toast/toast.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './register/register.component';
import { OurproductsComponent } from './ourproducts/ourproducts.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FooterComponent } from './footer/footer.component';
import { AdminComponent } from './admin/admin.component';
import { AdminHistoryComponent } from './admin-history/admin-history.component';
import { HeaderComponent } from './header/header.component';
import { DelieverHistoryComponent } from './deliever-history/deliever-history.component';
import { AdminDelieverComponent } from './admin-deliever/admin-deliever.component';

@NgModule({
  declarations: [
    AppComponent,
    
    AboutComponent,
    HomeComponent,
    CartComponent,
    LoginComponent,
    ToastComponent,
    ContactComponent,
    RegisterComponent,
    OurproductsComponent,
    CarouselComponent,
    ProductdetailComponent,
    OrderhistoryComponent,
    CheckoutComponent,
    FooterComponent,
    AdminComponent,
    AdminHistoryComponent,
    DelieverHistoryComponent,
    AdminDelieverComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    CarouselModule,
    BrowserAnimationsModule,
    NgSelectModule
  ],
  providers: [
   AuthenticationService,
    AuthGuardGuard,
    UserService,
    ToastComponent
    // { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
     //{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
