const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    education: { type: String, enum: ['Primary', 'Secondary'], required: true },

    required: { type: Number, required: true },
    paid: { type: Number, required: true },
    remaining: { type: Number,  default: 0  } // Change to 'false' or optional

}, { timestamps: true });


module.exports = mongoose.model('Student', studentSchema);
