const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/health', apiController.getHealth);
router.get('/weather', apiController.getWeather);
router.get('/search', apiController.searchLocation);
router.get('/reverse-geocode', apiController.getReverseGeocode);

module.exports = router;
