const express = require('express');
const {
    getProviders,
    getProvider,
    createProvider,
    updateProvider,
    deleteProvider
} = require('../controllers/provider');

// Include other resource routers
const carRouter = require('./car');
const bookingRouter = require('./booking');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:providerId/cars', carRouter);
// router.use('/:providerId/bookings', bookingRouter);

router.route('/')
    .get(getProviders)
    .post(protect, authorize('admin'), createProvider);

router.route('/:id')
    .get(getProvider)
    .put(protect, authorize('admin'), updateProvider)
    .delete(protect, authorize('admin'), deleteProvider);

module.exports = router;
