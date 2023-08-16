import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ExtraService } from './../../services/extra-service';

@Component({
  selector: 'app-reloj',
  templateUrl: './reloj.component.html',
  styleUrls: ['./reloj.component.css']
})
export class RelojComponent implements OnInit {

  public clock;

  constructor(private extraService: ExtraService) { }

  ngOnInit() {

    this.extraService.getTime().subscribe(time => {
      this.clock = time;
    });

    setInterval(() => {
      this.extraService.getTime().subscribe(time => {
        this.clock = time;
      });
    }, 60000);
  }

}
