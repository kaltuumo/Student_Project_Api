const mongoose = require('mongoose');

const classTimeSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  room: { type: String, required: true },
  day: { type: String, required: true }, // e.g., Monday
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },

  
},
{
     timestamps: true 
});

module.exports = mongoose.model('ClassTime', classTimeSchema);
