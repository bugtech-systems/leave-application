// models/Leave.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true,
    },
    leaveType: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    eventId: {
        type: String,
    },
    duration: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
