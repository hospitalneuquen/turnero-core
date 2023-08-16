import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { TurnosService } from './../../../../services/turnos.service';
import { IAlert } from './../../../../interfaces/IAlert';

@Component({
  selector: 'app-rollo',
  templateUrl: './rollo.component.html',
  styleUrls: ['./rollo.component.css']
})
export class RolloComponent implements OnInit {
  public colors: any[] = ['amarillo', 'celeste', 'rosado', 'verde', 'violeta'];
  public turnos: any = {};

  public alert: IAlert;

  constructor(private router: Router, private turnosService: TurnosService) { }

  ngOnInit() {
  }

  save(form) {
    console.log(form);
    if (form.valid) {

      this.turnosService.nuevoRollo(this.turnos).subscribe(turnos => {
        //this.onEditEmit.emit(turnos);
        this.alert = {
          message: 'Rollo agregado',
          class: 'success'
        };

        this.turnos = {};
        form.resetForm();

        setTimeout(() => {
          this.alert = null;
        }, 10000);

      }, err => {
        console.log(err);
        if (err) {
          const error = JSON.parse(err._body);

          this.alert = {
            message: error.message,
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
    this.router.navigate(['config/turnos']);
  }

}
