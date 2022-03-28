//Modules.
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
 
//Components.
import { AppComponent } from './app.component';
import { NavBarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CustomerComponent } from './customers/customer.component';
import { FormComponent } from './customers/form.component';
import { PaginatorComponent } from './customers/paginator/paginator.component';
import { DetailComponent } from './customers/detail/detail.component';

//Services.
import { CustomerService } from './customers/customer.service';
import { ModalService } from './customers/detail/modal.service';

//Router sheet.
const routes: Routes = [
  {path: '', redirectTo: '/customers', pathMatch: 'full'},
  {path: 'customers', component: CustomerComponent},
  {path: 'customers/page/:page', component: CustomerComponent},
  {path: 'customers/form', component: FormComponent},
  {path: 'customers/form/:id', component: FormComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    CustomerComponent,
    FormComponent,
    PaginatorComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    CustomerService,
    ModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
