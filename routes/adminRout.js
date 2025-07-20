const express = require('express');

const adminController = require('../controllers/adminController');
const router = express.Router();
router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);


router.get('/all-admin', adminController.getAdmin);
router.put('/update-admin/:id', adminController.updateAdmin);
router.delete('/delete-admin/:id', adminController.deleteAdmin);
module.exports = router;