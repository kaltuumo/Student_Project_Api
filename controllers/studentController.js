const Student = require('../models/studentModels'); 
const { studentSchema } = require('../middlewares/validator'); 
const {studentSignupSchema} = require('../middlewares/validator');

exports.createStudent = async (req, res) => {
    const { fullname, phone, gender, required, paid, remaining } = req.body;

    try {
        // Validate the input data
        const { error } = studentSignupSchema.validate({ fullname, phone, gender, required, paid, remaining });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // Remove the `$` symbol and convert to a number
        const requiredAmount = parseInt(required.replace('$', ''));
        const paidAmount = parseInt(paid.replace('$', ''));
        const remainingAmount = parseInt(remaining.replace('$', ''));

        const newStudent = new Student({
            fullname,
            phone,
            gender,
            required: requiredAmount,  // Store as number
            paid: paidAmount,          // Store as number
            remaining: remainingAmount // Store as number
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
                required: savedStudent.required,
                paid: savedStudent.paid,
                remaining: savedStudent.remaining,
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
                required: Student.required,
                paid: Student.paid,
                remaining: Student.remaining,
                phone: Student.phone,
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
};
