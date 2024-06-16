const express=require('express');
const { getReminders, addReminder, updateReminder, deleteReminder } = require('../controller/reminderController');
const { protect } = require('../controller/authController');
const router=express.Router();
router.use(protect);
router.route('/').get(getReminders).post(addReminder);
router.route('/:id').patch(updateReminder).delete(deleteReminder);
module.exports=router;
