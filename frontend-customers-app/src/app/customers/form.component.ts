import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Customer } from "./customer";
import { CustomerService } from "./customer.service";

import Swal from "sweetalert2";

@Component({
    selector: 'forma-dd',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
    
    customer:Customer;
    customerId: any;
    title:string;

    private errors: string[];

    constructor(private customerService: CustomerService, private router: Router, private activatedRoute: ActivatedRoute){}

    ngOnInit(): void {
        this.title = 'Create customer';
        this.customer = new Customer();
        //Every time user opens this form, it will load customer's data with given id.
        this.loadCustomer();
    }

    loadCustomer(): void{
        this.activatedRoute.params.subscribe(
            params => {
                this.customerId = params['id'];
                //Validate id, because it'll be the same form whether for updating and creating, 
                //so if user wants to create/add a new customer, id will not exist in route params.
                if(this.customerId != null){
                    this.title = 'Update customer';
                    //This will get customer data form DB, and with 2 way binding this will show customer's data in form.
                    this.customerService.getCustomer(this.customerId).subscribe(
                        returnedCustomer => this.customer = returnedCustomer
                    )
                }
            }
        );
    }

    //If subscription needs more than one parameter, use next, error, and complete as needed.
    createCustomer(): void{
        this.customerService.addCustomer(this.customer).subscribe({
            next: (customerCreated) => {
                this.router.navigate(['/customers']);
                Swal.fire('New customer', `Customer ${this.customer.name} created successfully`, 'success');
            },
            error: (err) => {
                this.errors = err.error.jsonErrors as string[];
                console.log('Status coming from backed' + err.Status);
                console.log(err.error.jsonErrors);
            }
        });
    }

    updateCustomer(): void{
        this.customerService.updateCustomer(this.customer).subscribe({
            next: (updatedCustomer) => {
                this.router.navigate(['/customers']);
                Swal.fire('Customer updated', `Customer ${this.customer.name} updated successfully!`, 'success');
            },
            error: (err) => {
                this.errors = err.error.jsonErrors as string[];
                console.log('Status coming from backed' + err.Status);
                console.log(err.error.jsonErrors);
            }
        });
    }
}