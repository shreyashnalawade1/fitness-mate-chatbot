const express=require('express');
const { getWeight, putWeight, updateWeight, deleteWeight, getHeight, putHeight, updateHeight, deleteHeight, getSleep, putSleep, updateSleep, deleteSleep, getTemperature, putTemperature, deleteTemperature, updateTemperature, getGlucose, putGlucose, updateGlucose, deleteGlucose, getLocation, putLocation, updateLocation, deleteLocation, getActivity, updateActivity, deleteActivity, getWaterLogs, putWaterLogs, updateWaterLog, deleteWaterLog, putActivity } = require('../controller/healthStatsController');
const { protect } = require('../controller/authController');

const router=express.Router();
router.use(protect);
router.route('/weight').get(getWeight).post(putWeight);
router.route('/weight/:id').patch(updateWeight).delete(deleteWeight);

router.route('/height').get(getHeight).post(putHeight);
router.route('/height/:id').patch(updateHeight).delete(deleteHeight);

router.route('/sleep').get(getSleep).post(putSleep);
router.route('/sleep/:id').patch(updateSleep).delete(deleteSleep);

router.route('/temperature').get(getTemperature).post(putTemperature);
router.route('/temperature/:id').patch(updateTemperature).delete(deleteTemperature);

router.route('/glucose').get(getGlucose).post(putGlucose);
router.route('/glucose/:id').patch(updateGlucose).delete(deleteGlucose);

router.route('/location').get(getLocation).post(putLocation);
router.route('/location/:id').patch(updateLocation).delete(deleteLocation);

router.route('/location').get(getLocation).post(putLocation);
router.route('/location/:id').patch(updateLocation).delete(deleteLocation);

router.route('/activity').get(getActivity).post(putActivity);
router.route('/activity/:id').patch(updateActivity).delete(deleteActivity);


router.route('/water').get(getWaterLogs).post(putWaterLogs);
router.route('/water/:id').patch(updateWaterLog).delete(deleteWaterLog);

module.exports=router;