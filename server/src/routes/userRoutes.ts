import { Router } from 'express';
import { agregarTelefono, createUser, getUser, searchUsers, updateUser} from '../controllers/userController';
const router = Router();

router.post('/', createUser);
router.get('/:clave', getUser);
router.put('/:clave', updateUser);
router.get('/search/:query', searchUsers);
router.put('/:id/telefonos', agregarTelefono);

export default router;