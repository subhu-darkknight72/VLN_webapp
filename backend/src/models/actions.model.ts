import mongoose from 'mongoose';
import { getObservationId } from './observations.model';

// action table has columns: obv_from, action, obv_to
// foreign key obv_from references observation(_id)
// foreign key obv_to references observation(_id)
const actionSchema = new mongoose.Schema({
    obv_from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Observation',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    obv_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Observation',
        required: true
    }
});

export const ActionModel = mongoose.model('Action', actionSchema);

export const getActionId = async (obv_from: string, action: string, obv_to: string) => {
    try {
        const obv_from_id = await getObservationId(obv_from);
        const obv_to_id = await getObservationId(obv_to);
        if (!obv_from_id || !obv_to_id) {
            throw new Error('Invalid observations');
        }

        const actionId = await ActionModel.findOne({
            obv_from: obv_from_id,
            action: action,
            obv_to: obv_to_id
        });
        return actionId?._id;
    }
    catch (err) {
        throw err;
    }
}

export const addAction = async (obv_from: string, action: string, obv_to: string) => {
    try {
        // get the id of the observation from which the action is performed
        const obv_from_id = await getObservationId(obv_from);
        const obv_to_id = await getObservationId(obv_to);
        if (!obv_from_id || !obv_to_id) {
            throw new Error('Invalid observations');
        }

        const newAction = {
            obv_from: obv_from_id,
            action: action,
            obv_to: obv_to_id
        };

        // check if the action already exists, return the id
        const actionExists = await ActionModel.findOne(newAction);
        if (actionExists) {
            return actionExists._id;
        }

        // else create a new action and return the id
        const savedAction = await new ActionModel(newAction).save();
        return savedAction._id;
    }
    catch (err) {
        throw err;
    }
}

export const getActions = async (obv_from: string) => {
    try {
        const obv_from_id = await getObservationId(obv_from);
        if (!obv_from_id) {
            throw new Error('Invalid observation');
        }

        // get all actions where obv_from is the given observation
        const actions = await ActionModel.find({
            obv_from: obv_from_id
        });

        // return the list of actions performed on the given observation
        var actionList = [];
        for (var i = 0; i < actions.length; i++) {
            actionList.push(actions[i].action);
        }
        return actionList;
    }
    catch (err) {
        throw err;
    }
}

export const getNextObservation = async (obv_from: string, action: string) => {
    try {
        const obv_from_id = await getObservationId(obv_from);
        if (!obv_from_id) {
            throw new Error('Invalid observation');
        }

        // get the id of the observation to which the action leads
        const actionId = await ActionModel.findOne({
            obv_from: obv_from_id,
            action: action
        });
        if (!actionId) {
            throw new Error('Invalid action');
        }

        const obv_to_id = actionId.obv_to;
        const obv_to = await mongoose.model('Observation').findById(obv_to_id);
        const nextObv = {
            observation: obv_to.observation,
            id: obv_to_id
        };
        return nextObv;
    }
    catch (err) {
        throw err;
    }
}