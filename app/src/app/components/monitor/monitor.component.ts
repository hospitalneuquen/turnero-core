import { VentanillaComponent } from './../ventanilla/ventanilla.component';
import { environment } from './../../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';

declare var EventSource: any;

@Component({
    selector: 'app-monitor',
    templateUrl: './monitor.component.html',
    styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

    public ventanillas;
    private mensajesServidor: any = {};
    private eventSource: any;
    private mensajePrevio: String = '';
    private EVENT_URL = environment.API + '/update';
    private ventanillaBlink: any = {};

    public audio = false;

    constructor(
        private VentanillasService: VentanillasService,
        private TurnosService: TurnosService,
        private changeDetector: ChangeDetectorRef) { }

    ngOnInit() {
        this.actualizarMonitor();
        this.escucharEventosServidor();
    }

    actualizarMonitor() {
        // Buscamos las ventanillas disponibles
        this.VentanillasService.get({ disponible: true }).subscribe(ventanillas => {
            // const ventanillasAux: any = ventanillas;
            this.ventanillas = ventanillas;
            this.ventanillas.forEach((ventanilla, i) => {
                this.TurnosService.get({ tipo: ventanilla.atendiendo }).subscribe(turnero => {
                // this.TurnosService.get({ tipo: ventanilla.atendiendo, estado: 'activo' }).subscribe(turnero => {
                    //this.ventanillas[i].turno = turnero[0];
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
            // console.table(this.mensajesServidor.result);

            // Detector de cambios: Si el último mensaje de la API es diferente al previo, actualizar!
            if (this.ventanillaBlink && this.mensajesServidor.result.type === 'default'
                && this.mensajesServidor.result.timestamp !== this.ventanillaBlink.timestamp) {
                this.ventanillaBlink = null;

                const index = this.ventanillas.findIndex( v => v._id === this.mensajesServidor.result.ventanilla._id);

                this.ventanillas[index] = this.mensajesServidor.result.ventanilla;
                this.ventanillas[index]['turno'] = this.mensajesServidor.result.turno;

                this.dingDong();
            } else {
                this.ventanillaBlink = this.mensajesServidor.result;

                if (this.mensajesServidor.result.type === 'pausar') {
                    const index = this.ventanillas.findIndex( v => v._id === this.mensajesServidor.result.ventanilla._id);

                    this.ventanillas[index] = this.mensajesServidor.result.ventanilla;
                }
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
