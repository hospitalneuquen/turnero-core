import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class ExtraService {
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
     * Trae la hora actual del servidor
     * @param {any} params Opciones de busqueda
     */
    getTime(): Observable<any> {
        const options = this.getDefaultOptions(null);

        return this.http.get(environment.API + '/time', options).map(this.extractData);
    }

}
