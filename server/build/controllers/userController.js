"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agregarTelefono = exports.searchUsers = exports.updateUser = exports.getUser = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new userModel_1.default(req.body);
        const savedUser = yield newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'ClaveUsuario ya existe' });
        }
        else {
            res.status(500).json({ message: 'Error al crear usuario', error });
        }
    }
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({ ClaveUsuario: req.params.clave });
        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield userModel_1.default.findOneAndUpdate({ ClaveUsuario: req.params.clave }, req.body, { new: true, runValidators: true });
        if (!updatedUser)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
});
exports.updateUser = updateUser;
const searchUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.params.query;
        console.log('Parámetro recibido:', query); // Depuración
        const regexClave = new RegExp(query, 'i');
        const regexNombre = new RegExp(query, 'i');
        console.log('Regex generado - Clave:', regexClave, 'Nombre:', regexNombre); // Depuración
        const users = yield userModel_1.default.find({
            $or: [
                { ClaveUsuario: regexClave },
                { NombreUsuario: regexNombre }
            ]
        }).limit(10);
        console.log('Usuarios encontrados:', users);
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.searchUsers = searchUsers;
const agregarTelefono = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield userModel_1.default.findByIdAndUpdate(req.params.id, { $addToSet: { Telefono: req.body.telefono } }, // Evita duplicados
        { new: true, runValidators: true });
        if (!usuario)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(usuario);
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Número telefónico inválido' });
        }
        res.status(500).json({ message: 'Error al actualizar teléfonos', error });
    }
});
exports.agregarTelefono = agregarTelefono;
