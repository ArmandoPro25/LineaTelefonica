import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const createUser: AsyncHandler = async (req, res) => {
    try {
        const newUser: IUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'ClaveUsuario ya existe' });
        } else {
            res.status(500).json({ message: 'Error al crear usuario', error });
        }
    }
};

export const getUser: AsyncHandler = async (req, res) => {
    try {
        const user = await User.findOne({ ClaveUsuario: req.params.clave });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error });
    }
};

export const updateUser: AsyncHandler = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { ClaveUsuario: req.params.clave },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
};

export const searchUsers: AsyncHandler = async (req, res, next) => {
    try {
      const query = req.params.query;
      console.log('Parámetro recibido:', query); // Depuración
      
      const regexClave = new RegExp(query, 'i');
      const regexNombre = new RegExp(query, 'i');
      console.log('Regex generado - Clave:', regexClave, 'Nombre:', regexNombre); // Depuración
  
      const users = await User.find({
        $or: [
          { ClaveUsuario: regexClave },
          { NombreUsuario: regexNombre }
        ]
      }).limit(10);
  
      console.log('Usuarios encontrados:', users);
      res.json(users);
    } catch (error) {
      next(error);
    }
  };


  export const agregarTelefono: AsyncHandler = async (req, res) => {
    try {
      const usuario = await User.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { Telefono: req.body.telefono } }, // Evita duplicados
        { new: true, runValidators: true }
      );
      
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(usuario);
      
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Número telefónico inválido' });
      }
      res.status(500).json({ message: 'Error al actualizar teléfonos', error });
    }
  };