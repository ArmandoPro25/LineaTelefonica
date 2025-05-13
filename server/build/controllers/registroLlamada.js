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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLlamadas = exports.getLlamadasByUsuario = exports.createLlamada = void 0;
const registroLllamada_1 = __importDefault(require("../models/registroLllamada"));
const userModel_1 = __importDefault(require("../models/userModel"));
const tipoLlamadaModel_1 = __importDefault(require("../models/tipoLlamadaModel"));
const createLlamada = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { claveUsuario, tipoLlamada: tipoLlamadaId, numeroMarcado } = _a, rest = __rest(_a, ["claveUsuario", "tipoLlamada", "numeroMarcado"]);
        const usuario = yield userModel_1.default.findOne({ ClaveUsuario: claveUsuario });
        const tipoLlamada = yield tipoLlamadaModel_1.default.findById(tipoLlamadaId);
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return next(); // ← Modificar esta línea
        }
        if (!tipoLlamada) {
            res.status(404).json({ message: 'Tipo de llamada no encontrado' });
            return next(); // ← Modificar esta línea
        }
        const nuevaLlamada = new registroLllamada_1.default(Object.assign(Object.assign({}, rest), { numeroMarcado, usuario: usuario._id, tipoLlamada: tipoLlamada._id, costoPorMinuto: tipoLlamada.costoPorMinuto, total: rest.minutosUtilizados * tipoLlamada.costoPorMinuto }));
        const llamadaGuardada = yield nuevaLlamada.save();
        res.status(201).json(llamadaGuardada);
        next(); // ← Añadir esta línea
    }
    catch (error) {
        next(error);
    }
});
exports.createLlamada = createLlamada;
const getLlamadasByUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield userModel_1.default.findOne({ ClaveUsuario: req.params.claveUsuario });
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        const llamadas = yield registroLllamada_1.default.find({ usuario: usuario._id })
            .populate('usuario', 'ClaveUsuario NombreUsuario')
            .populate('tipoLlamada', 'nombre costoPorMinuto');
        res.json(llamadas);
    }
    catch (error) {
        next(error);
    }
});
exports.getLlamadasByUsuario = getLlamadasByUsuario;
const getAllLlamadas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, numeroTelefono, tipoLlamada, fecha } = req.query;
        const filtro = {};
        if (search) {
            const usuarios = yield userModel_1.default.find({
                $or: [
                    { ClaveUsuario: new RegExp(search, 'i') },
                    { NombreUsuario: new RegExp(search, 'i') }
                ]
            }).select('_id');
            filtro.usuario = { $in: usuarios.map(u => u._id) };
        }
        if (numeroTelefono) {
            filtro.numeroTelefono = new RegExp(numeroTelefono, 'i');
        }
        if (tipoLlamada) {
            filtro.tipoLlamada = tipoLlamada;
        }
        if (fecha) {
            const startDate = new Date(fecha);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(fecha);
            endDate.setHours(23, 59, 59, 999);
            filtro.fechaLlamada = {
                $gte: startDate,
                $lte: endDate
            };
        }
        const llamadas = yield registroLllamada_1.default.find(filtro)
            .populate('usuario', 'ClaveUsuario NombreUsuario')
            .populate('tipoLlamada', 'nombre costoPorMinuto')
            .sort({ fechaLlamada: -1 });
        res.json(llamadas);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllLlamadas = getAllLlamadas;
