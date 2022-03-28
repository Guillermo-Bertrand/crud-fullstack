import { Component, Input, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { Customer } from "../customer";
import { CustomerService } from "../customer.service";
import { ModalService } from "./modal.service";

@Component({
    selector: 'detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent{

    @Input() currentCustomer : Customer;
    selectedImage : File;

    constructor(private modalService: ModalService, private customerService: CustomerService){
    }

    selectImage(event){
        this.selectedImage = event.target.files[0];

        if(this.selectedImage.type.indexOf('image') < 0){
            Swal.fire('Error selecting image', 'File must be of type image', 'error');
            this.selectedImage = null;
        }
    }

    uploadImage(){
        if(!this.selectedImage){
            Swal.fire('Error uploading image', 'You must select an image!', 'error');
        }else{
            this.customerService.uploadImage(this.selectedImage, this.currentCustomer.id).subscribe(
                response => {
                    this.currentCustomer = response;
                    this.modalService.notifyImageUploaded.emit(response);
                    this.selectedImage = null;
                    Swal.fire('Image uploadead!', 'Image has been uploaded successfully!', 'success');
                }
            );
        }
    }

    closeModal(){
        this.modalService.dismissModal();
    }
}