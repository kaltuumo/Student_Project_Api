const ClassTime = require('../models/classTimeModel');
const{classTimeSchema} = require ('../middlewares/validator')
exports.createClassTime = async (req, res) => {
    let { subject, teacher, room, day, startTime, endTime } = req.body;

    try {
        // Haddii aad leedahay Joi validation schema
        if (classTimeSchema) {
            const { error } = classTimeSchema.validate({ subject, teacher, room, day, startTime, endTime });
            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }
        }

        const newClass = new ClassTime({
            subject,
            teacher,
            room,
            day,
            startTime,
            endTime,
        });

        const savedClass = await newClass.save();

        // Format date & time in Africa/Mogadishu timezone
        const createdAtObj = new Date(savedClass.createdAt);
        const updatedAtObj = new Date(savedClass.updatedAt);

        const createdDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu',
        }).format(createdAtObj);

        const createdTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(createdAtObj);

        const updateDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu',
        }).format(updatedAtObj);

        const updateTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(updatedAtObj);

        res.status(201).json({
            success: true,
            message: 'Class time has been created',
            result: {
                _id: savedClass._id,
                subject: savedClass.subject,
                teacher: savedClass.teacher,
                room: savedClass.room,
                day: savedClass.day,
                startTime: savedClass.startTime,
                endTime: savedClass.endTime,
                createdDate,
                createdTime,
                updateDate,
                updateTime
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// GET STUDENTS 

exports.getClassTime = async (req, res) => {
    try {
        const classTimes = await ClassTime.find();

        const formattedClassTimes = classTimes.map((classTime) => {
            const createdAtObj = new Date(classTime.createdAt);
            const updatedAtObj = new Date(classTime.updatedAt);

            // Check for invalid date values
            if (isNaN(createdAtObj.getTime()) || isNaN(updatedAtObj.getTime())) {
                // console.warn("Invalid date found for classTime with ID:", classTime._id);
                return null;
            }

            const createdDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Mogadishu',
            }).format(createdAtObj);

            const createdTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Mogadishu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(createdAtObj);

            const updateDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Mogadishu',
            }).format(updatedAtObj);

            const updateTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Mogadishu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(updatedAtObj);
            
            return {
                _id: classTime._id,
                subject: classTime.subject,
                teacher: classTime.teacher,
                room: classTime.room,
                day: classTime.day,
                startTime: classTime.startTime,
                endTime: classTime.endTime,
                createdDate,
                createdTime,
                updateDate,
                updateTime,
            };
        }).filter(item => item !== null); // Remove invalid entries

        res.status(200).json({
            success: true,
            message: 'Class times fetched successfully',
            data: formattedClassTimes,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching class times' });
    }
};




// UPDATE STUDENT

exports.updateClassTime = async (req, res) => {
    const { subject, teacher,room, day, startTime, endTime } = req.body;
    const classId = req.params.id;  // Get the admin ID from the route parameter

    try {
        // Find the admin by ID
        const existingClasstime = await ClassTime.findById(classId);
        if (!existingClasstime) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        // Update admin details
        if (subject) existingClasstime.subject = subject;
        if (teacher) existingClasstime.teacher = teacher;
        if (room) existingClasstime.room = room;
        if (day) existingClasstime.data = day;
        if (startTime) existingClasstime.startTime = startTime;
        if (endTime) existingClasstime.endTime = endTime;

        
        // Save the updated admin
        const updatedClasstime = await existingClasstime.save();

        // Format the updated date and time for Somalia timezone (UTC+3)
        const updatedAtObj = new Date(updatedClasstime.updatedAt);

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
            message: 'Class updated successfully',
            result: {
                _id: updatedClasstime._id,
                subject: updatedClasstime.subject,
                teacher: updatedClasstime.teacher,
                room: updatedClasstime.room,
                day: updatedClasstime.day,
                startTime: updatedClasstime.startTime,
                endTime: updatedClasstime.endTime,
                updateDate,
                updateTime,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error updating Student' });
    }
};



exports.deleteClasstime = async (req, res) => {
    const classId = req.params.id;  // Get the 'id' from the URL parameter

    try {
        // Find the admin by ID and delete it
        const result = await ClassTime.findByIdAndDelete(classId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Class deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error deleting admin' });
    }
};

