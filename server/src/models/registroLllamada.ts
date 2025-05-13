import mongoose, { Schema, Document } from 'mongoose';
import User, { IUser } from './userModel';
import Llamada, { ILlamada } from './tipoLlamadaModel';

export interface ILlamadaRecord extends Document {
    usuario: IUser['_id'];
    numeroTelefono: string;
    fechaLlamada: Date;
    minutosUtilizados: number;
    numeroMarcado: {
        type: String,
        required: false
      },
    tipoLlamada: ILlamada['_id'];
    costoPorMinuto: number;
    total: number;
}

const LlamadaRecordSchema: Schema = new Schema({
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    numeroTelefono: {
        type: String,
        required: true
    },
    fechaLlamada: {
        type: Date,
        default: Date.now
    },
    minutosUtilizados: {
        type: Number,
        required: true,
        min: 0
    },
    numeroMarcado: {
        type: String,
        required: true
    },
    tipoLlamada: {
        type: Schema.Types.ObjectId,
        ref: 'Llamada',
        required: true
    },
    costoPorMinuto: {
        type: Number,
        required: false
    },
    total: {
        type: Number,
        required: false
    }
});

// Middleware para calcular el total antes de guardar
LlamadaRecordSchema.pre<ILlamadaRecord>('save', async function(next) {
    try {
        const tipoLlamada = await Llamada.findById(this.tipoLlamada);
        if (!tipoLlamada) throw new Error('Tipo de llamada no encontrado');
        
        this.costoPorMinuto = tipoLlamada.costoPorMinuto;
        this.total = this.minutosUtilizados * this.costoPorMinuto;
        next();
    } catch (error: any) {
        next(error);
    }
});

export default mongoose.model<ILlamadaRecord>('LlamadaRecord', LlamadaRecordSchema);