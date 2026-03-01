const express = require('express');
const {
    getBookings,
    getBooking,
    addBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/booking');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getBookings)
    .post(protect, authorize('car-renter', 'admin'), addBooking);

router.route('/:id')
    .get(protect, getBooking)
    .put(protect, authorize('car-renter', 'admin'), updateBooking)
    .delete(protect, authorize('car-renter', 'admin'), deleteBooking);

module.exports = router;
