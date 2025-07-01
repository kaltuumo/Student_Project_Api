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
    remaining: joi.number().min(0).optional(), // Add this line to allow remaining
    classStudent: joi.string().valid('Secondary Morning', 'Primary Morning', 'Primary AfterNoon').required(),
    classLevel: joi.string().valid(
        // Dynamically assign the class levels based on the selected class
        'Form One', 'Form Two', 'Form Three', 'Form Four', // for "Secondary Morning"
        '8th Grade', '7th Grade', '6th Grade', '5th Grade', // for "Primary Morning"
        '4th Grade', '3rd Grade', '2nd Grade', '1st Grade'  // for "Primary AfterNoon"
    ).when('classStudent', {
        is: 'Secondary Morning',
        then: joi.valid('Form One', 'Form Two', 'Form Three', 'Form Four').required(),
        otherwise: joi.when('class', {
            is: 'Primary Morning',
            then: joi.valid('8th Grade', '7th Grade', '6th Grade', '5th Grade').required(),
            otherwise: joi.when('class', {
                is: 'Primary AfterNoon',
                then: joi.valid('4th Grade', '3rd Grade', '2nd Grade', '1st Grade').required(),
                otherwise: joi.string()
            })
        })
    })
});


exports.classTimeSchema = joi.object({
    subject: joi.string().required(),
    teacher: joi.string().required(),
    room: joi.string().required(),
    day: joi.string().valid('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday').required(),
        // Accepts format like "2:30 PM", "08:00 AM"
    startTime: joi.string().pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i).required(),
    endTime: joi.string().pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i).required(),

});



