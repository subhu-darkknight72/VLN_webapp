import mongoose from "mongoose";

const observationSchema = new mongoose.Schema({
    observation: {
        type: String,
        required: true
    }
});

export const ObservationModel = mongoose.model('Observation', observationSchema);

export const getObservationId = async (observation: string) => {
    try {
        const observationId = await ObservationModel.findOne({
            observation
        });
        return observationId?._id;
    }
    catch (err) {
        throw err;
    }
}

export const getObservation = async (observationId: mongoose.Schema.Types.ObjectId) => {
    try {
        const observation = await ObservationModel.findById(observationId);
        return observation?.observation;
    }
    catch (err) {
        throw err;
    }
}

export const addObservation = async (observation: string) => {
    try {
        // if observation already exists, return the id
        const observationId = await getObservationId(observation);
        if (observationId) {
            return observationId;
        }

        // else create a new observation and return the id
        const newObservation = new ObservationModel({
            observation
        });
        const savedObservation = await newObservation.save();
        return savedObservation._id;
    }
    catch (err) {
        throw err;
    }
}