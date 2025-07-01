const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    education: { type: String, enum: ['Primary', 'Secondary'], required: true },
    required: { type: Number, required: true },
    paid: { type: Number, required: true },
    remaining: { type: Number, default: 0 },
    classStudent: { type: String, enum: ['Secondary Morning', 'Primary Morning', 'Primary AfterNoon'], required: true },
    classLevel: { 
        type: String,
        enum: ['Form One', 'Form Two', 'Form Three', 'Form Four', '8th Grade', '7th Grade', '6th Grade', '5th Grade', '4th Grade', '3rd Grade', '2nd Grade', '1st Grade'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
