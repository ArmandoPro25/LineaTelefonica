import express, { Application } from 'express';
import userRoutes from './routes/userRoutes';
import tipoLlamadaRoutes from './routes/tipoLlamadaRoutes';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import registroLlamadaRoutes from './routes/registroLlamadaRoutes';

dotenv.config();

class Server{
    public app: Application

    config(): void{
        this.app.set('port', process.env.PORT||3000);
        this.app.use(morgan('dev'));
        this.app.use(cors({
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'PUT'],
            allowedHeaders: ['Content-Type', 'Authorization']
          }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended : false}));
    }

    routes(): void{
        this.app.use('/users', userRoutes);
        this.app.use('/tipollamada', tipoLlamadaRoutes);
        this.app.use('/registrollamada', registroLlamadaRoutes);

    }

    async connectDB(): Promise<void> {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI no está definida en el entorno');
        }
        
        try {
            mongoose.set('strictQuery', false);
            await mongoose.connect(uri);
            console.log('MongoDB conectado correctamente');
        } catch (error) {
            console.error('Error de conexión a MongoDB:', error);
            process.exit(1);
        }
    }

    async start(): Promise<void> {
        try {
            await this.connectDB();
            this.app.listen(this.app.get('port'), () => {
                console.log(`Servidor conectado en el puerto ${this.app.get('port')}`);
            });
        } catch (error) {
            console.error('No se pudo iniciar el servidor:', error);
        }
    }
    constructor(){
        this.app = express();
        this.config();
        this.routes();        
    }
}

const server = new Server(); // Ejecuta la clase y devuelve un objeto.
server.start(); // Inicia el servidor.