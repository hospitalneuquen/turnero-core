import { Component, Input, Output, EventEmitter, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { VentanillasService } from './../../../services/ventanillas.service';
import { TurnosService } from './../../../services/turnos.service';
import { IVentanillas } from './../../../interfaces/IVentanillas';
import { IAlert } from './../../../interfaces/IAlert';

@Component({
    selector: 'app-panel-ventanilla',
    templateUrl: 'panel-ventanilla.html'
})

export class PanelVentanillaComponent implements OnInit {

    private _editarVentanilla: any;

    public showEditarVentanillaPanel: Boolean = true;
    public ventanillaActual: any = {};
    public alertas: any[] = [];
    public showEditarVentanilla: Boolean = false;

    public alert: IAlert;

    public enUso: any = [{
        estado: 'En uso',
        valor: true
    },
    {
        estado: 'Libre',
        valor: false
    }];

    @Input('editarVentanilla')
    set editarVentanilla(value: any) {
        this._editarVentanilla = value;
        this.ventanillaActual = value;
    }
    get editarVentanilla(): any {
        return this._editarVentanilla;
    }

    @Output() onEditEmit = new EventEmitter<Boolean>();
    @Output() onCloseEmit = new EventEmitter<Boolean>();

    @Input() ventanillas: any;


    constructor(public serviceVentanillas: VentanillasService,
        public router: Router) {
    }

    ngOnInit() {

        if (!this.ventanillaActual.disponible) {
            this.ventanillaActual.disponible = false;
        }
        if (!this.ventanillaActual.pausa) {
            this.ventanillaActual.pausa = false;
        }
        if (!this.ventanillaActual.prioritario) {
            this.ventanillaActual.prioritario = false;
        }
        if (!this.ventanillaActual.numeroVentanilla) {
            this.ventanillaActual.numeroVentanilla = this.ventanillas.length + 1;
        }

    }

    guardarVentanilla(form: any) {
        if (form.valid) {
            const existe = this.ventanillas.find(v => this.ventanillaActual.numeroVentanilla === v.numeroVentanilla);

            if (!this.ventanillaActual._id && typeof existe !== 'undefined') {
                this.alert = {
                    message: '<strong>La ventanilla ingresada ya existe</strong>',
                    class: 'danger'
                };

                setTimeout(() => {
                    this.alert = null;
                }, 5000);

                return false;
            }


            this.ventanillaActual.atendiendo = (this.ventanillaActual.atendiendo ? 'prioritario' : 'noPrioritario');

            let method = (!this.ventanillaActual._id) ? this.serviceVentanillas.post(this.ventanillaActual) : this.serviceVentanillas.put(this.ventanillaActual._id, this.ventanillaActual);

            method.subscribe(resultado => {
                debugger;
                this.ventanillaActual = resultado;

                this.alert = {
                    message: '<strong>La Ventanilla se guardó correctamente</strong>',
                    class: 'danger'
                };

                setTimeout(() => {
                    this.alert = null;
                }, 5000);

                this.onEditEmit.emit(true);

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
        this.showEditarVentanillaPanel = false;
        this.onCloseEmit.emit(true);
    }
}
