const joi = require('joi');
const mongoose = require('mongoose');

exports.adminSignupSchema = joi.object({
    fullname: joi.string()
        .min(3)
        .max(100)
        .required(),

    phone: joi.string()
        .pattern(/^[0-9]{9,15}$/)
        .required(),

    email: joi.string()
        .min(6)
        .max(60)
        .required()
        .email({ tlds: { allow: ['com', 'net'] } }),

    // Password: only numbers allowed
    password: joi.string()
        .min(6)
        .max(100)
        .required()
        .pattern(new RegExp('^[0-9]{6,100}$')) // Only numeric characters
});

exports.adminLoginSchema = joi.object({
    email: joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
        tlds: { allow: ['com', 'net'] }
    }),
    // Password: only numbers allowed
    password: joi.string()
    .required()
    .pattern(new RegExp('^[0-9]{6,100}$')) // Only numeric characters
});


exports.studentSignupSchema = joi.object({
    fullname: joi.string().min(3).max(100).required(),
    phone: joi.string()
        .pattern(/^[0-9]{9,15}$/)
        .required(),
    gender: joi.string().valid('Male', 'Female').required(),
    education: joi.string().valid('Primary', 'Secondary').required(),
    required: joi.number().min(0).required(),
    paid: joi.number().min(0).required(),
    // remaining: joi.number().min(0).optional() // Add this line to allow remaining

});

exports.classTimeSchema = joi.object({
    subject: joi.string().required(),
    teacher: joi.string().required(),
    room: joi.string().required(),
    day: joi.string().valid('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday').required(),
    startTime: joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // e.g. 13:00
    endTime: joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),   // e.g. 14:30
});



