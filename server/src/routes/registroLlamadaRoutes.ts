import { Router } from 'express';
import { createLlamada, getAllLlamadas, getLlamadasByUsuario } from '../controllers/registroLlamada';

const router = Router();

router.post('/', createLlamada);
router.get('/usuario/:claveUsuario', getLlamadasByUsuario);
router.get('/', getAllLlamadas);

export default router;