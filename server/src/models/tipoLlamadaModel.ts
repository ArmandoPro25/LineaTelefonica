import mongoose, { Schema, Document } from 'mongoose';

export interface ILlamada extends Document {
    nombre: string;
    costoPorMinuto: number;
}

const LlamadaSchema: Schema = new Schema({
    nombre: { 
        type: String, 
        required: true, 
        unique: true 
    },
    costoPorMinuto: { 
        type: Number, 
        required: true,
        min: 0
    }
});

export default mongoose.model<ILlamada>('Llamada', LlamadaSchema);