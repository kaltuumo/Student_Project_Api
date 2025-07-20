const express = require('express');

const classtimeController = require('../controllers/classTimeController')
const router = express.Router();

router.post('/create-classtime', classtimeController.createClassTime);
router.get('/all-classtime', classtimeController.getClassTime);
router.put('/update-classtime/:id', classtimeController.updateClassTime);
router.delete('/delete-classtime/:id', classtimeController.deleteClasstime);


module.exports = router;