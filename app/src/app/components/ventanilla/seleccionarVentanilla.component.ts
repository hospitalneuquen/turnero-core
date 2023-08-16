import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { IVentanillas } from './../../interfaces/IVentanillas';

@Component({
    selector: 'app-seleccionar-ventanilla',
    templateUrl: './seleccionarVentanilla.component.html',
    styleUrls: ['./seleccionarVentanilla.component.css']
})
export class SeleccionarVentanillaComponent implements OnInit {

    public ventanillas;

    constructor(private VentanillasService: VentanillasService,
        private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {

        const ventanillaActual = localStorage.getItem('ventanillaActual');

        if (ventanillaActual) {
            this.router.navigate(['ventanilla/', ventanillaActual]);
        }

        this.VentanillasService.get({}).subscribe(ventanillas => {
            this.ventanillas = ventanillas;
        });


    }

    seleccionar(ventanilla) {

        const patch = {
            key: 'enUso',
            value: true
        };

        this.VentanillasService.patch(ventanilla._id, patch).subscribe(v => {

            localStorage.setItem('ventanillaActual', ventanilla.numeroVentanilla);

            this.router.navigate(['ventanilla/', v.numeroVentanilla]);
        });

    }

}
