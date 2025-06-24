const Attendance = require('../models/attendanceModel')
exports.markAttendance = async (req, res) => {
  const { studentId, date, status } = req.body;

  try {
    const existing = await Attendance.findOne({ studentId, date });

    if (existing) {
      existing.status = status;
      await existing.save();
      return res.status(200).json({ success: true, message: 'Attendance updated' });
    }

    const attendance = new Attendance({ studentId, date, status });
    await attendance.save();

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAttendanceByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const records = await Attendance.find({ date }).populate('studentId');
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate('studentId');
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
