export interface ITurnos {
    id: string;
    _id: string;
    color: string;
    tipo: string;
    letraInicio: string;
    letraFin: string;
    numeroInicio: number;
    numeroFin: number;
    numeros: [{
        id: string,
        letra: string;
        numero: number;
        llamado: number;
        ventanilla: string,
        ultimoEstado: number;
        estado: [{
            fecha: Date;
            valor: string
        }]
    }];
    estado: [{
        fecha: Date;
        valor: string
    }];
}
