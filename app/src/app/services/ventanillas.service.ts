import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

// import { Server } from '@andes/shared';
import { IVentanillas } from './../interfaces/IVentanillas';
import { environment } from '../../environments/environment';
// import * as config from '../../../config';

@Injectable()
export class VentanillasService {
    constructor(private http: Http) { }

    extractData(res: Response) {
        return res.json();
    }

    getDefaultOptions(params) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({
            headers: headers
        });

        // establecemos los parametros de busqueda
        if (params) {
            options.search = new URLSearchParams();
            for (const param in params) {
                if (params[param]) {
                    options.search.set(param, params[param]);
                }
            }
        }

        return options;
    }

    /**
     * Metodo getById. Trae el objeto ventanilla por su Id.
     * @param {String} id Busca por Id
     */
    getById(id: String): Observable<IVentanillas> {
        const url = '/ventanillas/' + id;
        return this.http.get(environment.API + '/ventanillas').map(this.extractData);

    }

    /**
     * Metodo get. Trae lista de objetos ventanillas.
     * @param {any} params Opciones de busqueda
     */
    get(params: any): Observable<IVentanillas[]> {
        const options = this.getDefaultOptions(params);

        return this.http.get(environment.API + '/ventanillas', options).map(this.extractData);
        // return this.http.get(environment.API + '/ventanillas', options)
        //     .map((res: Response) => this.extractData(res));
    }



    /**
     * Metodo put. Actualiza un objeto ventanilla.
     * @param {IVentanilla} problema Recibe IVentanilla
     */
    post(ventanilla: any, params: any = null): Observable<any> {
        const url = '/ventanillas';

        const options = this.getDefaultOptions(params);

        return this.http.post(environment.API + url, JSON.stringify(ventanilla), options).map(this.extractData);
    }

    /**
     * Metodo put. Actualiza un objeto ventanilla.
     * @param {IVentanilla} problema Recibe IVentanilla
     */
    put(id: String, ventanilla: any, params: any = null): Observable<any> {
        const url = '/ventanillas/' + id;

        const options = this.getDefaultOptions(params);

        return this.http.put(environment.API + url, JSON.stringify(ventanilla), options).map(this.extractData);
    }

    patch(id: String, patch: any): Observable<IVentanillas> {
        const url = '/ventanillas/' + id;
        return this.http.patch(environment.API + url, patch).map(this.extractData);
    }

    delete(id: String): Observable<IVentanillas> {
        const url = '/ventanillas/' + id;
        return this.http.delete(environment.API + url).map(this.extractData);
    }

}
