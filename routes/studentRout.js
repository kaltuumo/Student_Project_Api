const express = require('express');


const studentController = require('../controllers/studentController');
const router = express.Router();

router.post('/create-student', studentController.createStudent);
router.get('/all-students', studentController.getStudent);
module.exports = router;