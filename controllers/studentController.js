const Student = require('../models/studentModels'); 
const { studentSchema } = require('../middlewares/validator'); 
const {studentSignupSchema} = require('../middlewares/validator');


exports.createStudent = async (req, res) => {
    let { fullname, phone, gender, education, required, paid, classStudent, classLevel} = req.body;

    try {
        // Validate the input data
        const { error } = studentSignupSchema.validate({ fullname, phone, gender, education, required, paid, classStudent, classLevel });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // Ensure required and paid are numbers
        const requiredAmount = typeof required === 'string' ? parseFloat(required.replace('$', '')) : required;
        const paidAmount = typeof paid === 'string' ? parseFloat(paid.replace('$', '')) : paid;

        
        const remainingAmount = requiredAmount - paidAmount;

        const newStudent = new Student({
            fullname,
            phone,
            gender,
            education,  
            required: requiredAmount,  // Store as number
            paid: paidAmount,          // Store as number
            remaining: remainingAmount, // Store as number
            classStudent: classStudent,
            classLevel: classLevel,
        });

        const savedStudent = await newStudent.save();

        // Format the created and updated date/time for Somalia timezone (UTC+3)
        const createdAtObj = new Date(savedStudent.createdAt);
        const updatedAtObj = new Date(savedStudent.updatedAt);

        const createdDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu'
        }).format(createdAtObj); // "YYYY-MM-DD"

        const createdTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(createdAtObj); // "HH:MM:SS"

        const updateDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu'
        }).format(updatedAtObj); // "YYYY-MM-DD"

        const updateTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(updatedAtObj); // "HH:MM:SS"

        res.status(201).json({
            success: true,
            message: "Student has been created",
            result: {
                _id: savedStudent._id,
                fullname: savedStudent.fullname,
                phone: savedStudent.phone,
                gender: savedStudent.gender,
                education: savedStudent.education,
                required: savedStudent.required,
                paid: savedStudent.paid,
                remaining: savedStudent.remaining,
                classStudent: savedStudent.classStudent,
                classLevel: savedStudent.classLevel,
                createdDate,
                createdTime,
                updateDate,
                updateTime
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




exports.getStudent = async (req, res) => {
    try {
        const students = await Student.find();  // Fetch all admins
        
        // Format the date and time for each admin
        const formattedStudents = students.map(Student => {
            const createdAtObj = new Date(Student.createdAt);
            const updatedAtObj = new Date(Student.updatedAt);

            // Format createdAt date and time
            const createdDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Mogadishu',
            }).format(createdAtObj); // "YYYY-MM-DD"

            const createdTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Mogadishu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(createdAtObj); // "HH:MM:SS"

            // Format updatedAt date and time
            const updateDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Mogadishu',
            }).format(updatedAtObj); // "YYYY-MM-DD"

            const updateTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Mogadishu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(updatedAtObj); // "HH:MM:SS"

            return {
                _id: Student._id,
                fullname: Student.fullname,
               gender: Student.gender,
                education: Student.education,
                required: Student.required,
                paid: Student.paid,
                remaining: Student.remaining,
                phone: Student.phone,
                classStudent: Student.classStudent,
                classLevel: Student.classLevel,
                createdDate,
                createdTime,
                updateDate,
                updateTime,
            };
        });

        res.status(200).json({
            success: true,
            message: 'Students fetched successfully',
            data: formattedStudents,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error fetching Students' });
    }

    
}

// UPDATE STUDENT


exports.updateStudent = async (req, res) => {
    const { fullname, gender,education, required, paid, phone } = req.body;
    const studentId = req.params.id;  // Get the admin ID from the route parameter

    try {
        // Find the admin by ID
        const existingStudent = await Student.findById(studentId);
        if (!existingStudent) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Update admin details
        if (fullname) existingStudent.fullname = fullname;
        if (gender) existingStudent.gender = gender;
        if (education) existingStudent.education = education;
        if (required) existingStudent.required = required;
        if (paid) existingStudent.paid = paid;
        if (phone) existingStudent.phone = phone;

          // Calculate remaining amount
         if (required && paid) {
            existingStudent.remaining = required - paid;
        } else {
            existingStudent.remaining = (existingStudent.required || 0) - (existingStudent.paid || 0);
        }
        // Save the updated admin
        const updatedStudent = await existingStudent.save();

        // Format the updated date and time for Somalia timezone (UTC+3)
        const updatedAtObj = new Date(updatedStudent.updatedAt);

        const updateDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu',
        }).format(updatedAtObj); // "YYYY-MM-DD"

        const updateTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(updatedAtObj); // "HH:MM:SS"

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            result: {
                _id: updatedStudent._id,
                fullname: updatedStudent.fullname,
                gender: updatedStudent.gender,
                education: updatedStudent.education,
                required: updatedStudent.required,
                paid: updatedStudent.paid,
                phone: updatedStudent.phone,
                remaining: updatedStudent.remaining,
                updateDate,
                updateTime,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error updating Student' });
    }
};

exports.deleteStudent = async (req, res) => {
    const studentId = req.params.id;  // Get the 'id' from the URL parameter

    try {
        // Find the admin by ID and delete it
        const result = await Student.findByIdAndDelete(studentId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error deleting admin' });
    }

    // Add this in your controller to fetch students who haven't paid the full amount


};

exports.getPendingStudents = async (req, res) => {
    try {
        const pendingStudents = await Student.find({ remaining: { $gt: 0 } });

        const formattedStudents = pendingStudents.map(student => ({
            _id: student._id,
            fullname: student.fullname,
            education: student.education,
            required: student.required,
            paid: student.paid,
            remaining: student.remaining,
        }));

        res.status(200).json({
            success: true,
            message: 'Pending students fetched successfully',
            data: formattedStudents,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error fetching pending students' });
    }
};


// Function to fetch student statistics
exports.getStudentStatistics = async (req, res) => {
  try {
    // Fetch total students
    const totalStudents = await Student.countDocuments();

    // Fetch active students
    const activeStudents = await Student.countDocuments({ status: 'active' });

    // Fetch inactive students
    const inactiveStudents = await Student.countDocuments({ status: 'inactive' });

    // Fetch pending students
     const pendingStudents = await Student.countDocuments({ remaining: { $gt: 0 },  });
    console.log("Pending Students: ", pendingStudents); // Debugging line

    // Fetch students who have made payments
    const paidStudents = await Student.countDocuments({ paid: { $gt: 0 } });

    // Fetch students with balance due (remaining > 0)
    const balanceDueStudents = await Student.countDocuments({ remaining: { $gt: 0 } });

    // Fetch fully paid students (remaining is 0)
    const fullyPaidStudents = await Student.countDocuments({ remaining: 0 });

    // Return the statistics
    res.status(200).json({
      success: true,
      message: 'Student statistics fetched successfully',
      data: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        pendingStudents,
        paidStudents,
        balanceDueStudents,
        fullyPaidStudents,
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Error fetching student statistics' });
  }
};
