import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { ITurnos } from './../../../../interfaces/ITurnos';
import { IAlert } from './../../../../interfaces/IAlert';

import { TurnosService } from './../../../../services/turnos.service';

@Component({
  selector: 'app-panel-turno',
  templateUrl: './panel-turno.component.html',
  styleUrls: ['./panel-turno.component.css']
})
export class PanelTurnoComponent implements OnInit, OnDestroy {

  public turnos: any = {};
  public colors: any[] = ['amarillo', 'celeste', 'rosado', 'verde', 'violeta'];

  public alert: IAlert;

  @Input() turno: any;

  // @Output() evtOutput: EventEmitter<any> = new EventEmitter<any>();

  @Output() onEditEmit = new EventEmitter<Boolean>();
  @Output() onCloseEmit = new EventEmitter<Boolean>();

  constructor(private turnosService: TurnosService) { }

  ngOnInit() {
    this.turnos = (this.turno) ? this.turno : {};

  }

  save(isValid: boolean) {
    if (isValid) {
      let method: any;

      if (this.turnos._id) {
        method = this.turnosService.put(this.turnos._id, this.turnos);
      } else {
        method = this.turnosService.post(this.turnos);
      }

      method.subscribe(turnos => {
        this.onEditEmit.emit(turnos);
      }, err => {
        if (err) {
          const error = JSON.parse(err._body);

          this.alert = {
            message: '<strong>' + error.message + '</strong>',
            class: 'danger'
          };

          setTimeout(() => {
            this.alert = null;
          }, 10000);
        }
      });

    }
  }

  cancelar() {
    this.onCloseEmit.emit(true);
  }

  ngOnDestroy() {
    this.turno = null;
  }
}
