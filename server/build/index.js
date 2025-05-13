"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tipoLlamadaRoutes_1 = __importDefault(require("./routes/tipoLlamadaRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const registroLlamadaRoutes_1 = __importDefault(require("./routes/registroLlamadaRoutes"));
dotenv.config();
class Server {
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)({
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'PUT'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/users', userRoutes_1.default);
        this.app.use('/tipollamada', tipoLlamadaRoutes_1.default);
        this.app.use('/registrollamada', registroLlamadaRoutes_1.default);
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = process.env.MONGODB_URI;
            if (!uri) {
                throw new Error('MONGODB_URI no está definida en el entorno');
            }
            try {
                mongoose_1.default.set('strictQuery', false);
                yield mongoose_1.default.connect(uri);
                console.log('MongoDB conectado correctamente');
            }
            catch (error) {
                console.error('Error de conexión a MongoDB:', error);
                process.exit(1);
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connectDB();
                this.app.listen(this.app.get('port'), () => {
                    console.log(`Servidor conectado en el puerto ${this.app.get('port')}`);
                });
            }
            catch (error) {
                console.error('No se pudo iniciar el servidor:', error);
            }
        });
    }
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
}
const server = new Server(); // Ejecuta la clase y devuelve un objeto.
server.start(); // Inicia el servidor.
