import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    ClaveUsuario: string;
    NombreUsuario: string;
    FechaRegistro: Date;
    FechaNacimiento: Date;
    Telefono: number[];
}

const UserSchema: Schema = new Schema({
    ClaveUsuario: { 
        type: String, 
        required: true, 
        unique: true 
    },
    NombreUsuario: { 
        type: String, 
        required: true 
    },
    FechaRegistro: { 
        type: Date, 
        default: Date.now 
    },
    FechaNacimiento: { 
        type: Date, 
        required: true 
    },
    Telefono: [{ 
        type: Number 
    }]
});

export default mongoose.model<IUser>('User', UserSchema);