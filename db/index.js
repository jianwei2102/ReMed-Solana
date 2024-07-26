const express = require('express');
const connectDB = require('./db');
const User = require('./models/users');
const DoctorRequest = require('./models/doctorRequest');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

// Fetch all users
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Add a new user
app.post('/users', async (req, res) => {
    const user = new User({
        username: req.body.username,
        address: req.body.address,
        role: req.body.role,
    });

    await user.save();
    res.json(user);
});

// Fetch all doctor requests
app.get('/doctorRequests', async (req, res) => {
    const doctorRequests = await DoctorRequest.find();
    res.json(doctorRequests);
});

// Add a new doctor request
app.post('/doctorRequests', async (req, res) => {
    const doctorRequest = new DoctorRequest({
        patientAddress: req.body.patientAddress,
        doctorAddress: req.body.doctorAddress,
        requestDate: req.body.requestDate,
    });

    await doctorRequest.save();
    res.json(doctorRequest);
});

// Delete a doctor request by ID
app.delete('/doctorRequests/:id', async (req, res) => {
    try {
        const result = await DoctorRequest.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Doctor Request not found' });
        }
        res.json({ message: 'Doctor Request removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
