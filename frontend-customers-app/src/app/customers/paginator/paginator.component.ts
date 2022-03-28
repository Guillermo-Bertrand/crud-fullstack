import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit{

    @Input() paginator: any;
    pages: number[];

    ngOnInit(): void {
        this.pages = new Array(this.paginator.totalPages).fill(0).map((value, index) => index + 1);
    }

}