const express = require('express');
const {
    getCars,
    getCar,
    createCar,
    updateCar,
    deleteCar
} = require('../controllers/car');

// Include other resource routers
const bookingRouter = require('./booking');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:carId/bookings', bookingRouter);

router.route('/')
    .get(getCars)
    .post(protect, authorize('admin', 'car-owner'), createCar);

router.route('/:id')
    .get(getCar)
    .put(protect, authorize('admin', 'car-owner'), updateCar)
    .delete(protect, authorize('admin', 'car-owner'), deleteCar);

module.exports = router;
