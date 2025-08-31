import { Router } from 'express';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';
import {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
} from '../controllers/companyController';

const router = Router();

router.use(authMiddleware);

router.post('/', authorizeRoles('super_admin'), createCompany);
router.get('/', authorizeRoles('super_admin', 'hr', 'manager'), getCompanies);
router.get('/:id', authorizeRoles('super_admin', 'hr', 'manager'), getCompanyById);
router.put('/:id', authorizeRoles('super_admin'), updateCompany);
router.delete('/:id', authorizeRoles('super_admin'), deleteCompany);

export default router;

