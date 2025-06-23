const express = require('express');


const studentController = require('../controllers/studentController');
const router = express.Router();

router.post('/create-student', studentController.createStudent);
router.get('/all-students', studentController.getStudent);
router.get('/get-pending', studentController.getPendingStudents)
router.delete('/delete-student/:id', studentController.deleteStudent);
router.put('/update-student/:id', studentController.updateStudent);

module.exports = router;