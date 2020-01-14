import { Component, Output, OnInit, EventEmitter } from '@angular/core';

import { ITurnos } from './../../../interfaces/ITurnos';
import { TurnosService } from './../../../services/turnos.service';

@Component({
  selector: 'hpn-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  public turnos: any;
  public colors: any[] = ['amarillo', 'celeste', 'rosado', 'verde', 'violeta'];

  @Output() evtOutput: EventEmitter<any> = new EventEmitter<any>();

  constructor(private turnosService: TurnosService) { }

  ngOnInit() {
    this.turnos = {
      color: '',
      letraInicio: '',
      letraFin: '',
      numeroInicio: '',
      numeroFin: '',
      tipo: ''
    };
  }

  save(model: ITurnos, isValid: boolean) {
    if (isValid) {
      this.turnosService.post(model).subscribe(turnos => {
        // this.evtOutput.emit(turnos);
        alert('Turno agregado');
      },
        err => {
          if (err) {
            alert('No se ha podido guardar el turno');
          }
        });
    }
  }
}
