import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';

// import { Server } from '@andes/shared';
import { ITurnos } from './../interfaces/ITurnos';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
// import * as config from '../../../config';

@Injectable()
export class TurnosService {
    constructor(private http: HttpClient) { }

    getDefaultOptions(params) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const options = {
            headers,
            search: null
        };

        if (params) {
            options.search = new HttpParams();
            for (const param in params) {
                if (params[param]) {
                    options.search = options.search.set(param, params[param]);
                }
            }
        }

        return options;
    }

    get(params: any): Observable<ITurnos[]> {
        const options = this.getDefaultOptions(params);

        return this.http.get<ITurnos[]>(environment.API + '/turnos', options);
    }

    getActual(id: any, idVentanilla: any, params: any = null) {
        const options = this.getDefaultOptions(params);

        return this.http.get(environment.API + '/turnos/' + id + '/ventanilla/' + idVentanilla, options);
    }

    getPrev(id: any, idVentanilla: any, params: any = null): Observable<ITurnos> {
        const options = this.getDefaultOptions(params);

        return this.http.get<ITurnos>(environment.API + '/turnos/' + id + '/ventanilla/' + idVentanilla + '/prev', options);
    }

    getNext(id: any, params: any = null): Observable<ITurnos> {
        const options = this.getDefaultOptions(params);

        return this.http.get<ITurnos>(environment.API + '/turnos/' + id + '/next', options);
    }

    getCount(id: any, params: any = null): Observable<any> {
        const options = this.getDefaultOptions(params);

        return this.http.get(environment.API + '/turnos/' + id + '/count', options);
    }

    post(doc: any, params: any = null): Observable<any> {
        const url = '/turnos/';

        const options = this.getDefaultOptions(params);

        return this.http.post(environment.API + url, JSON.stringify(doc), options);
    }

    put(id: string, doc: any, params: any = null): Observable<any> {
        const url = '/turnos/' + id;

        const options = this.getDefaultOptions(params);

        return this.http.put(environment.API + url, JSON.stringify(doc), options);
    }


    patch(id: string, doc: any, params: any = null): Observable<any> {
        const url = '/turnos/' + id;

        const options = this.getDefaultOptions(params);

        return this.http.patch(environment.API + url, JSON.stringify(doc), options);
    }

    delete(id: string, params: any = null): Observable<any> {
        const url = '/turnos/';
        const options = this.getDefaultOptions(params);
        return this.http.delete(environment.API + url + '/' + id, options);
    }
}
