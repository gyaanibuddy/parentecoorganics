import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './cart/cart.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './register/register.component';
import { OurproductsComponent } from './ourproducts/ourproducts.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { AdminHistoryComponent } from './admin-history/admin-history.component';
import { AboutComponent } from './about/about.component';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminComponent } from './admin/admin.component';
import { DelieverHistoryComponent } from './deliever-history/deliever-history.component';
import { AdminDelieverComponent } from './admin-deliever/admin-deliever.component';
import { AuthGuardGuard } from './_helpers/auth-guard.guard';

import { LoginComponent } from './login/login.component';
const routes: Routes = [
	{ path: 'login', component : LoginComponent  },
	{ path: 'home', component : HomeComponent  },
	{ path: 'getCart', component : CartComponent  },
	{ path: 'contact', component : ContactComponent  },
	{ path: 'register', component : RegisterComponent  },
	{ path: 'ourproducts', component : OurproductsComponent  },
	{ path: 'carousel', component : CarouselComponent  },
	{ path: 'productdetail/:pid', component : ProductdetailComponent },
	
	{ path: 'checkout/:oid', component : CheckoutComponent  },
	{ path: 'about', component : AboutComponent  },
	{ path: 'adminProduct', component : AdminComponent  },
	{ path: 'adminPlaced', component : AdminHistoryComponent  },
	{ path: 'adminDelievered', component : AdminDelieverComponent  },
	{ path: 'placeHistory', component : OrderhistoryComponent  },
	{ path: 'delieverHistory', component : DelieverHistoryComponent  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule],
  exports: [RouterModule]
}) 
export class AppRoutingModule { }