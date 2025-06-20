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
    fullname: joi.string()
        .min(3)
        .max(100)
        .required(),

    phone: joi.string()
        .pattern(/^[0-9]{9,15}$/)
        .required(),

    gender: joi.string()
        .valid('Male', 'Female')
        .required(),

    required: joi.string()  // Now accepting the value with $ sign
        .regex(/^\$\d+$/)  // Ensures the value starts with $ followed by numbers
        .required(),  

    paid: joi.string()  // Accepts the value with $ sign
        .regex(/^\$\d+$/)  // Ensures the value starts with $ followed by numbers
        .required(),  

    remaining: joi.string()  // Accepts the value with $ sign
        .regex(/^\$\d+$/)  // Ensures the value starts with $ followed by numbers
        .required()  
});
