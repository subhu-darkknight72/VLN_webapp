import { Request, Response } from 'express';
import HospitalService from '../services/hospital-services';

export const getInitialObservation = async (req: Request, res: Response) => {
    try {
        const observation = await HospitalService.getInitialObservation();
        return res.status(200).json({ 
            status: 200,
            observation: observation
         });
    }
    catch (err) {
        res.status(400).json({ 
            status: 400,
            error: err.message 
        });
    }
}

export const getActions = async (req: Request, res: Response) => {
    try {
        const observation = req.body.observation;
        const actions = await HospitalService.getActions(observation);
        return res.status(200).json({ 
            status: 200,
            actions: actions
         });
    }
    catch (err) {
        res.status(400).json({ 
            status: 400,
            error: err.message 
        });
    }
}

export const performAction = async (req: Request, res: Response) => {
    try {
        const observation = req.body.observation;
        const action = req.body.action;
        const nextObservation = await HospitalService.getNextObservation(observation, action);
        return res.status(200).json({ 
            status: 200,
            observation: nextObservation
         });
    }
    catch (err) {
        res.status(400).json({ 
            status: 400,
            error: err.message 
        });
    }
}

export const addHospitalAction = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ 
            status: 200,
            response: "Hospital added successfully"
         });
    }
    catch (err) {
        res.status(400).json({ 
            status: 400,
            error: err.message 
        });
    }
}