import { Observable, Subject } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../../services/ventanillas.service';
import { TurnosService } from './../../../services/turnos.service';
import { IVentanillas } from './../../../interfaces/IVentanillas';
import { IAlert } from './../../../interfaces/IAlert';
declare var EventSource: any;
@Component({
    selector: 'app-ventanillas',
    templateUrl: 'ventanillas.html'
})
export class ListaVentanillasComponent implements OnInit {

    private ventanillasSeleccionadas: any = [];
    private ventanillaSeleccionada: any = [];
    private ventanillas: any;
    private showEditarVentanillaPanel = false;

    public alert: IAlert;

    private servidorCaido = false;

    constructor(private VentanillasService: VentanillasService, private TurnosService: TurnosService,
        private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.inicializarVentanillas();
    }

    inicializarVentanillas() {
        this.VentanillasService.get({}).subscribe(ventanillas => {

            if (ventanillas.length) {
                this.ventanillas = ventanillas;
            } else {
                this.ventanillas = [];
            }

        }, error => {

            this.ventanillas = [];
            this.servidorCaido = true;

        });
    }

    estaSeleccionada(ventanilla: any) {
        return this.ventanillas.find(x => x.id === ventanilla._id);
    }

    seleccionarVentanilla(ventanilla) {
        let index;
        if (this.estaSeleccionada(ventanilla)) {
            index = this.ventanillasSeleccionadas.indexOf(ventanilla);
            this.ventanillasSeleccionadas.splice(index, 1);
            this.ventanillasSeleccionadas = [...this.ventanillasSeleccionadas];
        } else {
            this.ventanillasSeleccionadas = [...this.ventanillasSeleccionadas, ventanilla];
        }

        this.ventanillaSeleccionada = ventanilla;
        this.showEditarVentanillaPanel = true;
    }

    agregarVentanilla() {
        this.ventanillaSeleccionada = {};
        this.showEditarVentanillaPanel = true;
        this.inicializarVentanillas();
    }

    onCloseEmit() {
        this.showEditarVentanillaPanel = false;
        this.inicializarVentanillas();
    }

    onEditEmit() {
        this.showEditarVentanillaPanel = false;
        this.inicializarVentanillas();
    }

    /* Actualizar estados de la ventanilla */
    actualizarVentanilla(ventanilla, key, value) {
        const patch = {
            key: key,
            value: value
        };

        this.VentanillasService.patch(ventanilla._id, patch).subscribe(v => {
            this.alert = {
                message: '<strong>Ventanilla guardada</strong>',
                class: 'success'
            };

            setTimeout(() => {
                this.alert = null;
            }, 5000);

            this.inicializarVentanillas();
        });
    }

    eliminarVentanilla(ventanilla: any) {
        if (confirm('¿Eliminar Ventanilla?')) {
            this.VentanillasService.delete(ventanilla._id).subscribe(v => {
                this.alert = {
                    message: '<strong>Ventanilla elimianda</strong>',
                    class: 'success'
                };

                setTimeout(() => {
                    this.alert = null;
                }, 5000);

                this.inicializarVentanillas();
            });
        }
    }


}
