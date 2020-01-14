import * as mongoose from 'mongoose'

export const VentanillaSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: true
    },
    // nombre: {
    //     type: String,  // TODO usar slug + orden
    //     required: true
    // },
    prioritaria: {
        type: Boolean,
        default: false
    },
    pausa: {
        type: Boolean,
        default: false
    },
    disponible: {
        type: Boolean,
        default: false
    },
});

export const Ventanilla = mongoose.model('ventanillas', VentanillaSchema, 'ventanillas');
