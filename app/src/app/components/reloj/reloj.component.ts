import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
    selector: 'hpn-reloj',
    templateUrl: './reloj.component.html',
    styleUrls: ['./reloj.component.css']
})
export class RelojComponent implements OnInit {

    public clock;

    constructor() { }

    ngOnInit() {
        this.clock = interval(1000).pipe(
            map(() => new Date())
        );
    }

}
