import * as express from 'express';
// import { Turnero } from '../models/turnero';
import { Turno } from '../schemas/turno';
import { Types } from "mongoose";

// import * as utils from '../../../utils/utils';
// import { defaultLimit, maxLimit } from './../../../config';
const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let router = express.Router();

// Variable global para anunciar cambios desde el servidor
// Se puede setear dentro de cualquier ruta para anunciar cambios servidor ==> cliente
let cambio: any = { timestamp: new Date().getMilliseconds() };


// SSE
router.get('/update', (req, res, next) => {

    // Headers
    res.setHeader('Content-type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Message
    res.write('id: ' + (new Date().getMilliseconds()) + '\n');
    res.write('retry: 500\n');

    setInterval(() => {
        res.write('data:' + JSON.stringify({ result: cambio }) + '\n\n') // Note the extra newline
    }, 500);

});

// Service getActual() en la App
router.get('/turnos/:id/ventanilla/:ventanilla', async (req, res, next) => {

    // en aggreggation framework mongoose no hace el parseo instantaneo 
    // del string al object id, asique lo hacemos a mano
    const id = Types.ObjectId(req.params.id);
    const ventanilla = Types.ObjectId(req.params.ventanilla);


    const turnos = await Turno.aggregate([

        { '$project': { color: 1, tipo: 1, numeros: 1 } },
        { '$match': { _id: id } },
        { '$unwind': '$numeros' },
        { '$match': { 'numeros.ultimoEstado': 'llamado', 'numeros.ventanilla': ventanilla } },
        { '$unwind': '$numeros.estado' },
        { '$match': { 'numeros.estado.valor': 'llamado' } },
        { '$sort': { 'numeros.estado.fecha': -1 } },
        { '$limit': 1 }
    ]);
    return res.json(turnos);
});

router.get('/turnos/:id/ventanilla/:ventanilla/prev', async (req, res, next) => {
    const id = Types.ObjectId(req.params.id);
    const ventanilla = Types.ObjectId(req.params.ventanilla);

    const data = await Turno.aggregate([
        { '$project': { color: 1, tipo: 1, numeros: 1 } },
        { '$match': { _id: id } },
        { '$unwind': '$numeros' },
        { '$match': { 'numeros.ultimoEstado': 'llamado', 'numeros.ventanilla': ventanilla } },
        { '$unwind': '$numeros.estado' },
        { '$match': { 'numeros.estado.valor': 'llamado' } },
        { '$sort': { 'numeros.estado.fecha': -1 } }
    ]);

    if (data.length > 1) {
        cambio = {
            ventanilla: ventanilla,
            numeroAnterior: data[1].numeros.numero,
            tipo: data[1].tipo,
            timestamp: new Date().getMilliseconds()
        };
        res.json(data[1]);
    }
    else {
        cambio = {
            ventanilla: ventanilla,
            tipo: data[0].tipo,
            timestamp: new Date().getMilliseconds()
        };
        res.json(data[0]);
    }
});

router.get('/turnos/:id/next', async (req, res, next) => {
    const id = Types.ObjectId(req.params.id);

    const data = await Turno.aggregate([
        { $project: { "color": 1, "tipo": 1, "numeros": 1 } },
        { "$match": { "_id": id } },
        { "$unwind": "$numeros" },
        { "$match": { "numeros.ultimoEstado": 'libre' } },
        { $limit: 1 }
    ]);

    cambio = {
        timestamp: new Date().getMilliseconds()
    };
    return res.json(data);

});
// db.getCollection('turnos').aggregate([{"$match": {"_id": ObjectId("58ee710153b5d847c868ce83")}}, { "$unwind": "$numeros" },{"$match": {"numeros.ultimoEstado": 'libre'}}, { $limit : 1 }])

router.get('/turnos/:id/count', async (req, res, next) => {

    const id = Types.ObjectId(req.params.id);

    const turnos = await Turno.aggregate([
        { $project: { "color": 1, "tipo": 1, "numeros": 1 } },
        { "$match": { "_id": id } },
        { "$unwind": "$numeros" },
        { "$match": { "numeros.ultimoEstado": 'libre' } },
    ]);

    return res.json({
        count: turnos.length
    });

});

router.get('/turnos/:id*?', async (req, res, next) => {
    if (req.params.id) {
        const data = await Turno.findById(req.params.id);
        return res.json(data);
    } else {
        const query = Turno.find();
        if (req.query.tipo) {
            query.where('tipo').equals(req.query.tipo);
        }
        const data = await query;
        return res.json(data);
    }
});

router.get('/turnos', async (req, res, next) => {
    const data = await Turno.find();
    return res.json(data);
});

router.post('/turnos', async (req, res, next) => {
    let letras = [];
    let letraInicio = '', letraFin = '';

    // to lower
    if (req.body.letraInicio) {
        letraInicio = req.body.letraInicio.toLowerCase();
    }

    if (req.body.letraFin) {
        letraFin = req.body.letraFin.toLowerCase();
    }


    let turnos = new Turno(req.body);
    turnos['numeros'] = [];

    // filtramos las letras que vamos  utilizar
    if (letraInicio && letraFin) {
        letras = LETRAS.filter((letra) => {
            return (letra.charCodeAt(0) <= letraFin.charCodeAt(0)) ? letra : null;
        });

        if (letras.length) {
            // recorremos las letras
            letras.forEach(function (val, index) {
                let i = 0;
                // recorremos los numeros
                for (i; i < req.body.step; i++) {
                    const _turno = {
                        letra: val,
                        numero: i,
                        llamado: 0,
                        ultimoEstado: 'libre',
                        ventanilla: null,
                        estado: [{
                            fecha: new Date(),
                            valor: 'libre'
                        }]
                    };

                    turnos['numeros'].push(_turno);
                }

            });
        }
    } else {
        let i = req.body.numeroInicio;
        // recorremos los numeros
        for (i; i <= req.body.numeroFin; i++) {
            const _turno = {
                letra: null,
                numero: i,
                llamado: 0,
                ultimoEstado: 'libre',
                ventanilla: null,
                estado: [{
                    fecha: new Date(),
                    valor: 'libre'
                }]
            };

            turnos['numeros'].push(_turno);
        }
    }

    // asignamos el ultimo estado de resumen
    turnos['ultimoEstado'] = 'uso';
    // cargamos el estado en el array de estados
    turnos['estado'].push({ fecha: new Date(), valor: 'uso' });

    // guardamos el turno
    await turnos.save();

    return res.json(turnos);
});

router.put('/turnos/:id', async (req, res, next) => {
    const data = await Turno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(data);
});

router.patch('/turnos/:id', async (req, res, next) => {
    let conditions = {};
    let modificacion = {};
    let options = {};

    conditions['_id'] = req.params.id;

    if (req.body.accion) {

        if (req.body.accion === 'cambio_estado_numero') {
            conditions['numeros._id'] = req.body.idNumero;

            modificacion = {
                $push: { "numeros.$.estado": req.body.valores.estado }
            };

            options = { upsert: true };
        } else if (req.body.accion === 'cambio_ultimo_estado') {
            conditions['numeros._id'] = req.body.idNumero;

            modificacion = {
                $set: {
                    "numeros.$.ventanilla": req.body.valores.ventanilla,
                    "numeros.$.llamado": req.body.valores.llamado,
                    "numeros.$.ultimoEstado": req.body.valores.ultimoEstado
                }
            };

            options = { upsert: true };
        } else if (req.body.accion === 'rellamar') {
            conditions['numeros._id'] = req.body.idNumero;

            modificacion = {
                $inc: {
                    "numeros.$.llamado": req.body.valores.inc
                }
            };

            options = { upsert: true };
        } else if (req.body.accion === 'turnero_finalizado') {

            modificacion = {
                $push: {
                    estado: req.body.valores.estado
                },
                $set: {
                    "ultimoEstado": req.body.valores.ultimoEstado
                }
            };

            options = { upsert: true };
        }


    }

    const data = await Turno.findOneAndUpdate(conditions, modificacion, options);

    cambio = {
        ventanilla: req.body.valores.ventanilla,
        timestamp: new Date().getMilliseconds()
    };
    res.json(data);

});

// router.delete('/turnero/:id', function (req, res, next) {
//     Turnero.findByIdAndRemove(req.params._id, function (err, data) {
//         if (err) {
//             return next(err);
//         }

//         res.json(data);
//     });
// });

export default router;
