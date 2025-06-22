const express = require('express');


const studentController = require('../controllers/studentController');
const router = express.Router();

router.post('/create-student', studentController.createStudent);
router.get('/all-students', studentController.getStudent);
router.delete('/delete-student/:id', studentController.deleteStudent);

module.exports = router;