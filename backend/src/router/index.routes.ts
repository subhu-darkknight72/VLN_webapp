import { Router } from 'express';
import hospitalRouter from './hospital.routes';

const router = Router();
router.use('/hospital', hospitalRouter);

export default router;