import mongoose from "mongoose";
import { getActionId  } from "./actions.model";
import { getObservationId, getObservation } from "./observations.model";


const historySchema = new mongoose.Schema({
    action: {
        type: String,
        ref: 'Action',
        required: true
    },
    obv_to: {
        type: String,
        ref: 'Observation',
        required: true
    }
});

export const HistoryModel = mongoose.model('History', historySchema);

export const getLatestObservation = async () => {
    try {
        const latestObservation = await HistoryModel.findOne().sort({ _id: -1 });
        return latestObservation?.obv_to;
    }
    catch (err) {
        throw err;
    }
}

export const addHistory = async (action: string, obv_to: string) => {
    try {
        const newHistory = new HistoryModel({
            action,
            obv_to: obv_to
        });
        const savedHistory = await newHistory.save();
        return savedHistory;
    }
    catch (err) {
        throw err;
    }
}

export const clearHistory = async () => {
    try {
        await HistoryModel.deleteMany({});
        console.log('History cleared');
        const initialAction = 'initialize';

        const initialObservation = "hallway: This room is called the hallway. This is the main corridor in the ground floor from which we can go to other rooms.";
        await addHistory(initialAction, initialObservation);
    }
    catch (err) {
        throw err;
    }
}