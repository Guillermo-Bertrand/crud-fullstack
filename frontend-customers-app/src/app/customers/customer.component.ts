import { Component, OnInit } from "@angular/core";
import { CustomerService } from "./customer.service";
import { ModalService } from "./detail/modal.service";
import { Customer } from "./customer";
import Swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'customers',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit{

    private currentPage: number;

    customers: Customer[];
    customerSelected: Customer;
    jsonData: any;
    modalActivated: boolean;   

    constructor(private customerService: CustomerService, 
                private activatedRoute: ActivatedRoute, 
                private modalService: ModalService){}

    ngOnInit(): void {
        /*this.customerService.getCustomers().subscribe(
            (customersJson) => this.customers = customersJson
        );*/
        this.loadCustomersPage();

        this.modalService.notifyImageUpload().subscribe(customer => {
            this.customers.map(currentCustomer => {
                if(currentCustomer.id === customer.id) currentCustomer.photo = customer.photo;
                return currentCustomer;
            })
        });
    }

    startModal(customer: Customer){
        this.modalActivated = this.modalService.showModal();
        this.customerSelected = customer;
    }

    loadCustomersPage(): void{
        this.activatedRoute.params.subscribe(
            params => {
                this.currentPage = params['page'];

                //When application just started, currentPage does not exists in activatedRoute, so give it 0 as value to load first records.
                if(this.currentPage == null) this.currentPage = 0;

                this.customerService.getCustomersByPage(this.currentPage).subscribe(
                    json => {
                        this.customers = json.content as Customer[];
                        //And save all the json to use all attributes in pagnator component.
                        this.jsonData = json;
                    }
                );
            }
        );
    }

    deleteCustomer(customer: Customer): void{
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: `You will not be able to revert deleting customer ${customer.name} ${customer.lastName}!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
          }).then((result) => {

            if (result.isConfirmed) {
                this.customerService.deleteCustomer(customer.id).subscribe(
                    response => {
                        this.customers = this.customers.filter(
                            //Show customers id they're different from the deleted one.
                            auxCustomer => auxCustomer !== customer
                        )
                        Swal.fire('Customer deleted', `Customer ${customer.name} ${customer.lastName} has been deleted succesfully`, 'success');
                    }
                )
            }
          })
    }
}