import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';
import { IVentanillas } from './../../interfaces/IVentanillas';

@Component({
    selector: 'hpn-panel-ventanilla',
    templateUrl: 'panel-ventanilla.html'
})

export class PanelVentanillaComponent implements OnInit {

    showEditarVentanilla = false;

    private eeditarVentanilla: any;
    @Input('editarVentanilla')
    set editarVentanilla(value: any) {
        this.eeditarVentanilla = value;
        this.ventanillaActual = value;
    }
    get editarVentanilla(): any {
        return this.eeditarVentanilla;
    }

    @Output() editEmit = new EventEmitter<boolean>();
    @Output() closeEmit = new EventEmitter<boolean>();

    @Input() ventanillasCount: any;

    showEditarVentanillaPanel = true;

    public ventanillaActual: any = {};

    public alertas: any[] = [];

    constructor(public serviceVentanillas: VentanillasService, public router: Router) {
    }

    ngOnInit() {

        if (!this.ventanillaActual.disponible) {
            this.ventanillaActual.disponible = false;
        }
        if (!this.ventanillaActual.pausa) {
            this.ventanillaActual.pausa = false;
        }
        if (!this.ventanillaActual.prioritaria) {
            this.ventanillaActual.prioritaria = false;
        }
        if (!this.ventanillaActual.numero) {
            this.ventanillaActual.numero = this.ventanillasCount + 1;
        }

    }

    guardarVentanilla() {

        if (!this.ventanillaActual._id) {
            this.serviceVentanillas.post(this.ventanillaActual).subscribe(resultado => {
                this.ventanillaActual = resultado;

                alert('La Ventanilla se guardó correctamente');
                this.editEmit.emit(true);
            });
        } else {
            this.serviceVentanillas.put(this.ventanillaActual._id, this.ventanillaActual).subscribe(resultado => {
                this.ventanillaActual = resultado;

                alert('La Ventanilla se actualizó correctamente');
                this.editEmit.emit(true);
            });

        }


    }


    cancelar() {
        this.showEditarVentanillaPanel = false;
        this.closeEmit.emit(true);
    }

}
