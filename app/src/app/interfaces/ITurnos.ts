export interface ITurnos {
    id: String;
    _id: String;
    color: String;
    tipo: String;
    letraInicio: String;
    letraFin: String;
    numeroInicio: Number;
    numeroFin: Number;
    numeros: [{
        id: String,
        letra: String;
        numero: Number;
        llamado: Number;
        ventanilla: String,
        ultimoEstado: Number;
        estado: [{
            fecha: Date;
            valor: String
        }]
    }];
    estado: [{
        fecha: Date;
        valor: String
    }];
}
