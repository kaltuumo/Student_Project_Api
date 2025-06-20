const jwt = require("jsonwebtoken");
const transport = require("../middlewares/sendMail");
const { hmacProcess, doHash } = require("../utils/hashing");
const Admin = require("../models/adminModels");
const { adminSignupSchema } = require("../middlewares/validator");
const {adminLoginSchema} = require("../middlewares/validator");
const { doHashValidation } = require("../utils/hashing");

exports.signup = async (req, res) => {
    const { fullname, email, password, phone } = req.body;

    try {
        const { error } = adminSignupSchema.validate({ fullname, email, password, phone });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(401).json({ success: false, message: 'Admin already exists!' });
        }

        // Hash the password
        const hashedPassword = await doHash(password, 12);

        // Create new admin
        const newAdmin = new Admin({
            fullname,
            email,
            password: hashedPassword,
            phone,
        });

        // Save admin to the database
        const savedAdmin = await newAdmin.save();

        // Format the created and updated date/time for Somalia timezone (UTC+3)
        const createdAtObj = new Date(savedAdmin.createdAt);
        const updatedAtObj = new Date(savedAdmin.updatedAt);

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

        // Send response back with the new admin details including creation and update time
        res.status(201).json({
            success: true,
            message: "Your Account Has been Created",
            result: {
                _id: savedAdmin._id,
                fullname: savedAdmin.fullname,
                email: savedAdmin.email,
                phone: savedAdmin.phone,
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



exports.login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const { error, value } = adminLoginSchema.validate({ email, password });
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		const existingAdmin = await Admin.findOne({ email }).select('+password');
		if (!existingAdmin) {
			return res
				.status(401)
				.json({ success: false, message: 'Admin does not exists!' });
		}
		const result = await doHashValidation(password, existingAdmin.password);
		if (!result) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials!' });
		}
		const token = jwt.sign(
			{
				userId: existingAdmin._id,
				email: existingAdmin.email,
				fullname: existingAdmin.fullname,
				phone: existingAdmin.phone,
				verified: existingAdmin.verified,
			},
			process.env.TOKEN_SECRET,
            {
                expiresIn: '1d',
            }
			
		);

		res
			.cookie('Authorization', 'Bearer ' + token, {
				expires: new Date(Date.now() + 8 * 3600000),
				httpOnly: process.env.NODE_ENV === 'production',
				secure: process.env.NODE_ENV === 'production',
			})
			.json({
				success: true,
				token,
				message: 'Login successfully',
			});
	} catch (error) {
		console.log(error);
	}
};

exports.logout = async (req, res) => {
	res
		.clearCookie('Authorization')
		.status(200)
		.json({ success: true, message: 'logged out successfully' });
};


exports.getAdmin = async (req, res) => {
    try {
        const admins = await Admin.find();  // Fetch all admins
        
        // Format the date and time for each admin
        const formattedAdmins = admins.map(admin => {
            const createdAtObj = new Date(admin.createdAt);
            const updatedAtObj = new Date(admin.updatedAt);

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

                userId: admin._id,
                fullname: admin.fullname,
                email: admin.email,
                phone: admin.phone,
                createdDate,
                createdTime,
                updateDate,
                updateTime,
            };
        });

        res.status(200).json({
            success: true,
            message: 'Admins fetched successfully',
            data: formattedAdmins,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error fetching admins' });
    }
};


exports.updateAdmin = async (req, res) => {
    const { fullname, email, password, phone } = req.body;
    const adminId = req.params.id;  // Get the admin ID from the route parameter

    try {
        // Find the admin by ID
        const existingAdmin = await Admin.findById(adminId);
        if (!existingAdmin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        // Update admin details
        if (fullname) existingAdmin.fullname = fullname;
        if (email) existingAdmin.email = email;
        if (password) existingAdmin.password = await doHash(password, 12);
        if (phone) existingAdmin.phone = phone;

        // Save the updated admin
        const updatedAdmin = await existingAdmin.save();

        // Format the updated date and time for Somalia timezone (UTC+3)
        const updatedAtObj = new Date(updatedAdmin.updatedAt);

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
            message: 'Admin updated successfully',
            result: {
                _id: updatedAdmin._id,
                fullname: updatedAdmin.fullname,
                email: updatedAdmin.email,
                phone: updatedAdmin.phone,
                updateDate,
                updateTime,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error updating admin' });
    }
};

exports.deleteAdmin = async (req, res) => {
    const adminId = req.params.id;  // Get the 'id' from the URL parameter

    try {
        // Find the admin by ID and delete it
        const result = await Admin.findByIdAndDelete(adminId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error deleting admin' });
    }
};



