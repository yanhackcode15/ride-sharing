const express = require('express');
const router = express.Router();
const { register, login, updateDriverAvailability, getAvailableDriver, getThisAvaiableDriver } = require('../controllers/user.controller');
const validateRegistrationData = require('../middleware/validateRegistrationData');
const validateLoginData = require('../middleware/validateLoginData')
const validateDriverAvailability = require('../middleware/validateDriverAvailability')
// Define routes related to users
router.post('/register', validateRegistrationData, register);
router.post('/login', validateLoginData, login);
router.patch('/:id/availability', validateDriverAvailability, updateDriverAvailability); // Using URL parameter for userId, availability either true or false will be sent in the body     
//{ availability: true }
router.get('/drivers/available', getAvailableDriver) // this is where trip service will query for a ride

router.get('/:id/isAvailable', getThisAvaiableDriver)
module.exports = router;
