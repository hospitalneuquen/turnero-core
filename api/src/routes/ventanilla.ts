import * as express from 'express';
import { Ventanilla } from '../schemas/ventanilla';
import * as mongoose from 'mongoose';

let router = express.Router();

// variable para anunciar cambios desde el servidor
let cambio: any = (new Date().getMilliseconds());

// SSE
router.get('/update', (req, res, next) => {

    // Headers
    res.setHeader('Content-type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Message
    res.write('id: ' + (new Date().getMilliseconds()) + '\n');
    res.write('retry: 1000\n');

    setInterval(() => {
        res.write('data:' + JSON.stringify({ result: cambio }) + '\n\n') // Note the extra newline
    }, 1000);

});

// Get 1
router.get('/ventanillas/:id*?', async (req, res, next) => {
    if (req.params.id) {
        const data = await Ventanilla.findById(req.params.id);
        return res.json(data);
    } else {
        const query = Ventanilla.find();

        if (req.query.numero) {
            query.where('numero').equals(req.query.numero);
        }

        const data = await query;
        return res.json(data);
    }
});

// Get all
router.get('/ventanillas', async (req, res, next) => {
    const list = await Ventanilla.find();
    return res.json(list);
});

// Insert
router.post('/ventanillas', async (req, res, next) => {

    const insertVentanilla = new Ventanilla(req.body);

    await insertVentanilla.save();
    return res.json(insertVentanilla);
});

// Update
router.put('/ventanillas/:id', async (req, res, next) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next('ObjectID Inválido');
    }

    let updateVentanilla = new Ventanilla(req.body);

    updateVentanilla.isNew = false;

    await updateVentanilla.save();
    return res.json(updateVentanilla);

});

// Cambios únicos del tipo { key: value }
router.patch('/ventanillas/:id', async (req, res, next) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next('ObjectID Inválido');
    }

    const ventanilla = await Ventanilla.findById(req.params.id);
    ventanilla.set(req.body.key, req.body.value);
    await ventanilla.save();

    if (req.body.key === 'pausada') {
        if (req.body.value === false) {
            cambio = 'reanudar-' + (new Date().getMilliseconds());
        } else {
            cambio = 'pausar-' + (new Date().getMilliseconds());
        }
    } else {
        cambio = (new Date().getMilliseconds());
    }

    return res.json(ventanilla);

});

// Pum!
router.delete('/ventanillas/:id', async (req, res, next) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next('ObjectID Inválido');
    }

    const data = await Ventanilla.findById(req.params.id);
    await data.remove();

    return res.json(data);

});

export default router;
