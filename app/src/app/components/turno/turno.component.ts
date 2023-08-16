import { VentanillasService } from './../../services/ventanillas.service';
import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';

import { TurnosService } from './../../services/turnos.service';
import { ITurnos } from './../../interfaces/ITurnos';

@Component({
    selector: 'app-turno',
    templateUrl: './turno.component.html',
    styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit {

    @Input() turno: any; // turno actual
    @Input() ventanilla: any;

    disponibles: Number;
    existeSiguiente: Boolean = true;
    ultimoTurnoLlamado: any;

    llamar = true;
    rellamar = true;

    constructor(private TurnosService: TurnosService, private VentanillasService: VentanillasService) { }

    ngOnInit() {
    }

    // count() {
    //     this.TurnosService.getCount(this.turno._id).subscribe(turnos => {
    //         this.disponibles = turnos.count || 0;
    //     });
    // }

    reLlamar(turno, tipo) {
        let dto = {};

        if (tipo === 'actual') {
            dto = {
                accion: 'rellamar',
                tipo: turno.tipo,
                idTurno: turno._id
            };

            this.VentanillasService.patch(this.ventanilla._id, dto).subscribe((ventanillaPatch: any) => {
                this.ventanilla = ventanillaPatch;

                this.rellamar = false;
                this.TurnosService.getActual(turno._id).subscribe(actual => {
                    this.turno = actual;
                    // this.turno = actual[0];

                    setTimeout(() => {
                        this.rellamar = true;
                    }, 2200);
                });
            });

        // } else if (tipo === 'anterior') {
        //     this.TurnosService.getPrev(this.turno._id, this.ventanilla._id).subscribe(anterior => {

        //     });
        }
    }

    siguiente(turno) {
        const dto = {
            accion: 'siguiente',
            tipo: turno.tipo,
            idTurno: turno._id
        };

        this.llamar = false;
        this.VentanillasService.patch(this.ventanilla._id, dto).subscribe( (ventanillaPatch: any) => {
            this.ventanilla = ventanillaPatch.ventanilla;

            setTimeout(() => {
                this.llamar = true;
            }, 2200);

            // this.turno = ventanillaPatch.turno;

            // this.TurnosService.getActual(this.turno._id).subscribe(turno => {
            //     this.turno = turno[0];
            // });
        }, (err) => {
            setTimeout(() => {
                this.llamar = true;
            }, 2200);
        });

        // this.evtOutput.emit(this.turno);
    }

    puedeLlamar() {
        return this.llamar;
    }

    puedReLlamar() {
        return this.rellamar;
    }
}
