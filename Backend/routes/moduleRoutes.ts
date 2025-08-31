import { Router } from 'express';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';
import {
    createModule,
    getModules,
    getModuleById,
    updateModule,
    deleteModule,
} from '../controllers/moduleController';

const router = Router();

router.use(authMiddleware);

router.post('/', authorizeRoles('super_admin', 'admin'), createModule);
router.get('/', authorizeRoles('super_admin', 'admin', 'hr', 'manager'), getModules);
router.get('/:id', authorizeRoles('super_admin', 'admin', 'hr', 'manager'), getModuleById);
router.put('/:id', authorizeRoles('super_admin', 'admin'), updateModule);
router.delete('/:id', authorizeRoles('super_admin'), deleteModule);

export default router;

