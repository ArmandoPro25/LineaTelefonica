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
exports.updateLlamada = exports.getAllLlamadas = exports.getLlamadaByNombre = void 0;
const tipoLlamadaModel_1 = __importDefault(require("../models/tipoLlamadaModel"));
const getLlamadaByNombre = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const llamada = yield tipoLlamadaModel_1.default.findOne({ nombre: req.params.nombre });
        if (!llamada) {
            res.status(404).json({ message: 'Tipo de llamada no encontrado' });
            return;
        }
        res.json(llamada);
    }
    catch (error) {
        next(error); // Pasa el error al middleware de errores
    }
});
exports.getLlamadaByNombre = getLlamadaByNombre;
// Aplica el mismo patrón a los demás controladores
const getAllLlamadas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const llamadas = yield tipoLlamadaModel_1.default.find();
        res.json(llamadas);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllLlamadas = getAllLlamadas;
const updateLlamada = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedLlamada = yield tipoLlamadaModel_1.default.findOneAndUpdate({ nombre: req.params.nombre }, req.body, { new: true, runValidators: true });
        if (!updatedLlamada) {
            res.status(404).json({ message: 'Tipo de llamada no encontrado' });
            return;
        }
        res.json(updatedLlamada);
    }
    catch (error) {
        next(error);
    }
});
exports.updateLlamada = updateLlamada;
