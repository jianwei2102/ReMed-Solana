const mongoose = require('mongoose');

const doctorRequestSchema = new mongoose.Schema({
    patientAddress: {
        type: String,
        required: true
    },
    doctorAddress: {
        type: String,
        required: true
    },
    requestDate: {
        type: String,
        required: true
    },
});

const DoctorRequest = mongoose.model('DoctorRequest', doctorRequestSchema);
module.exports = DoctorRequest;