const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController'); // Make sure this path is correct

// Route to mark attendance
router.post('/mark', attendanceController.markAttendance);

// Route to get attendance for a specific date
router.get('/:date', attendanceController.getAttendanceByDate);

// Optional: Route to get all attendance records
router.get('/', attendanceController.getAllAttendance);

module.exports = router;
