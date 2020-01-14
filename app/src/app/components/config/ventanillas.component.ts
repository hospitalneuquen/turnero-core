import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';
import { IVentanillas } from './../../interfaces/IVentanillas';
declare var EventSource: any;
@Component({
    selector: 'hpn-ventanillas',
    templateUrl: 'ventanillas.html'
})
export class ListaVentanillasComponent implements OnInit {

    private ventanillasSeleccionadas: any = [];
    public ventanillaSeleccionada: any = [];
    public ventanillas: any;
    public showEditarVentanillaPanel = false;

    public servidorCaido = false;

    constructor(
        private ventanillasService: VentanillasService,
        private turnosService: TurnosService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.inicializarVentanillas();
    }

    inicializarVentanillas() {
        this.ventanillasService.get({}).subscribe(ventanillas => {

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
            key,
            value
        };
        this.ventanillasService.patch(ventanilla._id, patch).subscribe(v => {
            this.inicializarVentanillas();
        });
    }

    eliminarVentanilla(ventanilla: any) {
        if (confirm('¿Eliminar Ventanilla?')) {
            this.ventanillasService.delete(ventanilla._id).subscribe(v => {
                this.inicializarVentanillas();
            });
        }
    }


}
