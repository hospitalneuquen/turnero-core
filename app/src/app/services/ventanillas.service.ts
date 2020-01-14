import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// import { Server } from '@andes/shared';
import { IVentanillas } from './../interfaces/IVentanillas';
import { environment } from '../../environments/environment';
// import * as config from '../../../config';

@Injectable()
export class VentanillasService {
    constructor(private http: HttpClient) { }

    extractData(res: Response) {
        return res.json();
    }

    getDefaultOptions(params) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const options = {
            headers,
            params: null
        };

        // establecemos los parametros de busqueda
        if (params) {
            options.params = new HttpParams();
            for (const param in params) {
                if (params[param]) {
                    options.params = options.params.set(param, params[param]);
                }
            }
        }

        return options;
    }

    getById(id: string): Observable<IVentanillas> {
        const url = '/ventanillas/' + id;
        return this.http.get<IVentanillas>(environment.API + '/ventanillas');

    }

    get(params: any): Observable<IVentanillas[]> {
        const options = this.getDefaultOptions(params);

        return this.http.get<IVentanillas[]>(environment.API + '/ventanillas', options);
    }



    post(ventanilla: any, params: any = null): Observable<any> {
        const url = '/ventanillas';

        const options = this.getDefaultOptions(params);

        return this.http.post(environment.API + url, JSON.stringify(ventanilla), options);
    }

    put(id: string, ventanilla: any, params: any = null): Observable<any> {
        const url = '/ventanillas/' + id;

        const options = this.getDefaultOptions(params);

        return this.http.put(environment.API + url, JSON.stringify(ventanilla), options);
    }

    patch(id: string, patch: any): Observable<IVentanillas> {
        const url = '/ventanillas/' + id;
        return this.http.patch<IVentanillas>(environment.API + url, patch);
    }

    delete(id: string): Observable<IVentanillas> {
        const url = '/ventanillas/' + id;
        return this.http.delete<IVentanillas>(environment.API + url);
    }

}
