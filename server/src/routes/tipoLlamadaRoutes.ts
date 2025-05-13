import { Router } from 'express';
import { getAllLlamadas, getLlamadaByNombre, updateLlamada } from '../controllers/tipoLlamadaController';

const router = Router();

router.get('/', getAllLlamadas);
router.get('/:nombre', getLlamadaByNombre);
router.put('/:nombre', updateLlamada);

export default router;