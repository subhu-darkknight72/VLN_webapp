import { Router } from 'express';
import {
    getInitialObservation,
    getActions,
    performAction,
    addHospitalAction
} from '../controllers/hospital.controller';

const hospitalRouter = Router();
hospitalRouter.get('/', getInitialObservation);
hospitalRouter.post('/add-action', addHospitalAction);
hospitalRouter.get('/actions', getActions);
hospitalRouter.post('/perform-action', performAction);

export default hospitalRouter;
