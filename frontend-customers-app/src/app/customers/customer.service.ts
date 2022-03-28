import { Injectable } from "@angular/core";
import { map, Observable, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Customer } from "./customer";
import { catchError } from "rxjs";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Injectable()
export class CustomerService{

    private urlEndPoint: string = 'http://localhost:8080/api/customers';
    private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

    constructor(private http:HttpClient, private router:Router){}
    
    //------------------------------------------- Method to get all records in database ----------------------------------------------------
    
    //Http object and its methods always will return an observable, so it's not necessary use "of" anymore.
    getCustomers(): Observable<Customer[]>{
        return this.http.get<Customer[]>(this.urlEndPoint);
    }
    //------------------------------------------- Method to get all records by pages --------------------------------------------------------

    //This observable will be of type any, because we need to get json that has more information than just customer's data.
    getCustomersByPage(page: number): Observable<any>{
        return this.http.get<any>(`${this.urlEndPoint}/page/${page}`);
    }

    getCustomer(id:number): Observable<Customer>{
        //Use pipe to handle all streams in observable.
        return this.http.get<Customer>(`${this.urlEndPoint}/${id}`).pipe(
            //Catch possible errors coming from server.
            catchError(e => {
                //Navigate to crud table, because this method it's used to get customer by id when updating.
                this.router.navigate(['/customers']);
                //And show error to user.
                Swal.fire('There was a problem updating that customer :(', e.error.message, 'error');
                return throwError(() => e);
            })
        );
    }

    uploadImage(photo: any, id): Observable<Customer>{

        let formData = new FormData();
        formData.append('file', photo);
        formData.append('id', id);

        return this.http.post<Customer>(`${this.urlEndPoint}/upload`, formData).pipe(
            map((response: any) => response.customer as Customer), 
            catchError(e => {
                Swal.fire('There was a problem uploading the image', e.error.message, 'error');
                return throwError(() => e);
            })
        );
    }

    addCustomer(customer: Customer): Observable<Customer>{
        return this.http.post<Customer>(this.urlEndPoint, customer, {headers: this.httpHeaders}).pipe(
            catchError(e => {
                //In case of having any error, return it.
                if(e.Status == 400) return throwError(() => e);

                this.router.navigate(['/customers']);
                Swal.fire('There was a problem creating that customer :(', e.error.message, 'error');
                return throwError(() => e);
            })
        );
    }

    updateCustomer(customer: Customer): Observable<Customer>{
        return this.http.put<Customer>(`${this.urlEndPoint}/${customer.id}`, customer, {headers: this.httpHeaders}).pipe(
            catchError(e => {

                if(e.Status == 400) return throwError(() => e);

                this.router.navigate(['/customers']);
                Swal.fire('There was a problem updating that customer :(', e.error.message, 'error');
                return throwError(() => e);
            })
        );
    }

    deleteCustomer(id:number): Observable<Customer>{
        return this.http.delete<Customer>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
            catchError(e => {
                Swal.fire('There was a problem deleting that customer :(', e.error.message, 'error');
                return throwError(() => e);
            })
        );
    }
}