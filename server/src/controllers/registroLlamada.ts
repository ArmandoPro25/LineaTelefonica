import { Request, Response, NextFunction } from 'express';
import LlamadaRecord from '../models/registroLllamada';
import User from '../models/userModel';
import Llamada from '../models/tipoLlamadaModel';

// Tipo personalizado para controladores async
type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const createLlamada: AsyncHandler = async (req, res, next) => {
    try {
      const { claveUsuario, tipoLlamada: tipoLlamadaId, numeroMarcado, ...rest } = req.body;
      
      const usuario = await User.findOne({ ClaveUsuario: claveUsuario });
      const tipoLlamada = await Llamada.findById(tipoLlamadaId);
      
  
      if (!usuario) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return next(); // ← Modificar esta línea
      }
      
      if (!tipoLlamada) {
        res.status(404).json({ message: 'Tipo de llamada no encontrado' });
        return next(); // ← Modificar esta línea
      }
  
      const nuevaLlamada = new LlamadaRecord({
        ...rest,
        numeroMarcado,
        usuario: usuario._id,
        tipoLlamada: tipoLlamada._id,
        costoPorMinuto: tipoLlamada.costoPorMinuto,
        total: rest.minutosUtilizados * tipoLlamada.costoPorMinuto
      });
  
      const llamadaGuardada = await nuevaLlamada.save();
      res.status(201).json(llamadaGuardada);
      next(); // ← Añadir esta línea
  
    } catch (error: any) {
      next(error);
    }
  };

export const getLlamadasByUsuario: AsyncHandler = async (req, res, next) => {
  try {
    const usuario = await User.findOne({ ClaveUsuario: req.params.claveUsuario });
    
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const llamadas = await LlamadaRecord.find({ usuario: usuario._id })
      .populate('usuario', 'ClaveUsuario NombreUsuario')
      .populate('tipoLlamada', 'nombre costoPorMinuto');

    res.json(llamadas);
    
  } catch (error: any) {
    next(error);
  }
};

export const getAllLlamadas: AsyncHandler = async (req, res, next) => {
    try {
      const { search, numeroTelefono, tipoLlamada, fecha } = req.query;
      
      const filtro: any = {};
  
      if (search) {
        const usuarios = await User.find({
          $or: [
            { ClaveUsuario: new RegExp(search as string, 'i') },
            { NombreUsuario: new RegExp(search as string, 'i') }
          ]
        }).select('_id');
        
        filtro.usuario = { $in: usuarios.map(u => u._id) };
      }
  
      if (numeroTelefono) {
        filtro.numeroTelefono = new RegExp(numeroTelefono as string, 'i');
      }
  
      if (tipoLlamada) {
        filtro.tipoLlamada = tipoLlamada;
      }
  
      if (fecha) {
        const startDate = new Date(fecha as string);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(fecha as string);
        endDate.setHours(23, 59, 59, 999);
        
        filtro.fechaLlamada = {
          $gte: startDate,
          $lte: endDate
        };
      }
  
      const llamadas = await LlamadaRecord.find(filtro)
        .populate('usuario', 'ClaveUsuario NombreUsuario')
        .populate('tipoLlamada', 'nombre costoPorMinuto')
        .sort({ fechaLlamada: -1 });
  
      res.json(llamadas);
      
    } catch (error: any) {
      next(error);
    }
  };