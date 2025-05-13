import { Request, Response, NextFunction } from 'express';
import Llamada, { ILlamada } from '../models/tipoLlamadaModel';

// Tipo personalizado para manejar los controladores async
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const getLlamadaByNombre: AsyncHandler = async (req, res, next) => {
    try {
        const llamada = await Llamada.findOne({ nombre: req.params.nombre });
        if (!llamada) {
            res.status(404).json({ message: 'Tipo de llamada no encontrado' });
            return;
        }
        res.json(llamada);
    } catch (error) {
        next(error); // Pasa el error al middleware de errores
    }
};

// Aplica el mismo patrón a los demás controladores
export const getAllLlamadas: AsyncHandler = async (req, res, next) => {
    try {
        const llamadas = await Llamada.find();
        res.json(llamadas);
    } catch (error) {
        next(error);
    }
};

export const updateLlamada: AsyncHandler = async (req, res, next) => {
    try {
        const updatedLlamada = await Llamada.findOneAndUpdate(
            { nombre: req.params.nombre },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedLlamada) {
            res.status(404).json({ message: 'Tipo de llamada no encontrado' });
            return;
        }
        res.json(updatedLlamada);
    } catch (error) {
        next(error);
    }
};