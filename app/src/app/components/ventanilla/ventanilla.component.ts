import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';
import { IVentanillas } from './../../interfaces/IVentanillas';
declare var EventSource: any;
@Component({
    selector: 'hpn-ventanilla',
    templateUrl: './ventanilla.component.html'
})
export class VentanillaComponent implements OnInit {
    sinVentanillas: boolean;

    public numero;
    public ventanilla: any;
    public prioritario: any;
    public noPrioritario: any;
    public turnoActualPrioritario: any;
    public turnoActualNoPrioritario: any;

    constructor(
        private ventanillasService: VentanillasService,
        private turnosService: TurnosService,
        private route: ActivatedRoute
    ) {

    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            // obtenemos el parametro del nombre de la ventanilla enviado
            this.numero = params.numero;

            // TODO: si no tenemos numero redireccionamos a la seleccion de ventanilla
            this.inicializarVentanilla();
        });

        // TODO: si no se paso el id nombre de la ventanilla, entonces lo
        // levantamos de la session e inicializamos la ventanilla
        // var ventanillaActual = JSON.parse(localStorage.getItem('ventanillaActual'));
        // console.log(ventanillaActual);
    }

    inicializarVentanilla() {
        this.ventanillasService.get({ numero: this.numero }).subscribe(ventanilla => {

            if (ventanilla[0]) {
                this.ventanilla = ventanilla[0];

                localStorage.setItem('ventanillaActual', this.ventanilla.numero);

                this.sinVentanillas = false;

                this.inicializarTurneros();

            } else {
                // alert('ventanilla no encontrada');
                this.sinVentanillas = true;
            }

        });
    }

    inicializarTurneros() {

        // obtenemos prioritario
        this.turnosService.get({ tipo: 'prioritario', ultimoEstado: 'uso' }).subscribe(turnos => {

            // TODO: Revisar de enviar limit : 1
            if (turnos[turnos.length - 1]) {
                this.prioritario = turnos[turnos.length - 1];

                this.turnosService.getActual(this.prioritario._id, this.ventanilla._id).subscribe(actual => {
                    this.turnoActualPrioritario = actual[0];
                });

            } else {

            }
        });

        // obtenemos no prioritario
        this.turnosService.get({ tipo: 'no-prioritario', ultimoEstado: 'uso' }).subscribe(turnos => {
            if (turnos[turnos.length - 1]) {
                this.noPrioritario = turnos[turnos.length - 1];

                this.turnosService.getActual(this.noPrioritario._id, this.ventanilla._id).subscribe(actual => {
                    this.turnoActualNoPrioritario = actual[0];
                });

            }
        });
    }

    /* Pausar ventanilla */
    pausar() {
        this.actualizarVentanilla('pausa', true);
        this.inicializarVentanilla();
    }

    /* Reanudar ventanilla */
    reanudar() {
        this.actualizarVentanilla('pausa', false);
        this.inicializarVentanilla();
    }

    /* Actualizar estados de la ventanilla */
    actualizarVentanilla(key, value) {
        const patch = {
            key,
            value
        };
        this.ventanillasService.patch(this.ventanilla._id, patch).subscribe(v => {
            this.inicializarVentanilla();
        });
    }
}
