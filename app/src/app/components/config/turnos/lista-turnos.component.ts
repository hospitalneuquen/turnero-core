import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { ITurnos } from './../../../interfaces/ITurnos';
import { IAlert } from './../../../interfaces/IAlert';
import { TurnosService } from './../../../services/turnos.service';

@Component({
  selector: 'app-lista-turnos',
  templateUrl: './lista-turnos.component.html',
  styleUrls: ['./lista-turnos.component.css']
})
export class ListaTurnosComponent implements OnInit {
  public showEditarTurno: Boolean = false;
  public turnoSeleccionado: any;
  public turnos: any[] = [];
  public alert: IAlert;

  constructor(private turnosService: TurnosService, private router: Router) { }

  ngOnInit() {
    this.inicializarTurnos();
    this.alert = null;
  }

  inicializarTurnos() {
    this.turnosService.get({}).subscribe(turnos => {
      this.turnos = turnos;
    });
  }

  agregarTurno() {
    this.showEditarTurno = true;
    this.turnoSeleccionado = null;
  }

  editarTurno(turno) {
    if (turno.estado !== 'finalizado') {
      this.turnoSeleccionado = turno;
      this.showEditarTurno = true;
    }
  }

  delete(turno: any) {
    let message = '¿Eliminar turno?';

    if (turno.estado === 'activo' && turno.ultimoNumero <= turno.numeroFin) {
      message += ' Tenga en cuenta que el turno a eliminar se está utilizando actualmente.';
    }

    if (confirm(message)) {
      this.turnosService.delete(turno._id).subscribe(v => {
        this.alert = {
          message: '<strong>Turno elimiando</strong>',
          class: 'success'
        };

        setTimeout(() => {
          this.alert = null;
        }, 5000);

        this.inicializarTurnos();
      });
    }
  }

  onCloseEmit() {
    this.showEditarTurno = false;
  }

  onEditEmit() {
    this.showEditarTurno = false;
    this.inicializarTurnos();
    this.alert = {
      message: '<strong>Turno agregado</strong>',
      class: 'success'
    };

    setTimeout(() => {
      this.alert = null;
    }, 5000);
  }


  agregarRollo() {
    this.router.navigate(['config/turnos/rollo']);
  }
}
