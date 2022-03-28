import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class ModalService{
    
    modalActivated: boolean;
    notifyImageUploaded = new EventEmitter<any>();

    constructor(){
        this.modalActivated = false;
    }

    showModal(): boolean{
        return this.modalActivated = true;
    }

    dismissModal(): void{
        this.modalActivated = false
    }

    notifyImageUpload(): EventEmitter<any>{
        return this.notifyImageUploaded;
    }
}