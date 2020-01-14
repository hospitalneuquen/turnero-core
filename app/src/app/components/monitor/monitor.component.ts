import { environment } from './../../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';

declare var EventSource: any;

@Component({
    selector: 'hpn-monitor',
    templateUrl: './monitor.component.html',
    styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

    public ventanillas;
    private mensajesServidor: any = {};
    private eventSource: any;
    private mensajePrevio = '';
    private EVENT_URL = environment.API + '/update';
    public ventanillaBlink: any = {};

    public audio = false;

    constructor(
        public ventanillasService: VentanillasService,
        private turnosService: TurnosService,
        private changeDetector: ChangeDetectorRef) { }

    ngOnInit() {
        this.escucharEventosServidor();
        this.actualizarMonitor();
    }

    actualizarMonitor() {
        // buscamos ventanillas disponibles
        this.ventanillasService.get({ disponible: true }).subscribe(ventanillas => {
            const ventanillasAux: any = ventanillas;

            // buscamos los turneros que están en uso
            this.turnosService.get({ ultimoEstado: 'uso' }).subscribe(turnos => {

                // Buscamos el último número que haya llamado una ventanilla para un turnero
                ventanillasAux.forEach(ventanilla => {
                    if (typeof ventanilla.turno === 'undefined') {
                        ventanilla.turno = {};
                    }

                    turnos.forEach(turno => {
                        // Trae un array de 1 sólo elemento
                        this.turnosService.getActual(turno._id, ventanilla._id).subscribe(actual => {

                            if (actual && actual[0]) {
                                if (typeof ventanilla.turno._id === 'undefined') {
                                    ventanilla.turno = actual[0];
                                } else {
                                    const dateCargado = new Date(ventanilla.turno.numeros.estado.fecha);
                                    const dateActual = new Date(actual[0].numeros.estado.fecha);

                                    if (dateActual > dateCargado) {
                                        ventanilla.turno = actual[0];
                                    }
                                }
                            }
                        });
                    });
                    this.ventanillas = ventanillas;
                });
            });
        });
    }

    escucharEventosServidor() {
        // Crea un nuevo objeto EventSource que viene de la API
        // Mantiene actualizado el número de turno desde el servidor
        this.eventSource = new EventSource(this.EVENT_URL, { withCredentials: false });

        // Para la oreja a los mensajes de servidor
        this.eventSource.onmessage = (evt) => {

            // Se actualiza el mensaje de servidor
            this.mensajesServidor = JSON.parse(evt.data);

            // Detector de cambios: Si el último mensaje de la API es diferente al previo, actualizar!
            if (this.ventanillaBlink && this.mensajesServidor.result.timestamp !== this.ventanillaBlink.timestamp) {
                this.ventanillaBlink = null;
                this.actualizarMonitor();
                this.dingDong();
            } else {
                this.ventanillaBlink = this.mensajesServidor.result;
                // console.log('this.ventanillaBlink', this.ventanillaBlink);
            }

            // Detectar cambios
            this.changeDetector.detectChanges();

        };
    }

    dingDong() {
        this.audio = true;
        setTimeout(() => {
            this.audio = false;
        }, 2200);
    }

}
