const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const adminRouter = require('./routes/adminRout');
const studentRouter = require('./routes/studentRout'); // Import the student router
const attendanceRoutes = require('./routes/attendanceRout');
const classtimeRoute = require('./routes/classTimeRoutes')
require('dotenv').config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Failed to connect to MongoDB', err);   
});


app.use('/api/admin', adminRouter);
app.use('/api/students', studentRouter); 
app.use('/api/classes', classtimeRoute); 


app.use('/api/attendance', attendanceRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send({message:'Hello From The server!'});
});

// Start the server
const port = process.env.PORT || 7001;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});