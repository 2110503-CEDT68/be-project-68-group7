const Car = require('../models/Car');
const Appointment = require('../models/Appointment');

// @desc    Get all cars
// @route   GET /api/v1/cars
// @access  Public
exports.getCars = async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string with MongoDB operators ($gt, $gte, etc.)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource & Populate appointments (from Virtual)
    query = Car.find(JSON.parse(queryStr)).populate('appointments');

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Car.countDocuments();

    query = query.skip(startIndex).limit(limit);

    try {
        const cars = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }

        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count: cars.length,
            pagination,
            data: cars
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single car
// @route   GET /api/v1/cars/:id
// @access  Public
exports.getCar = async (req, res, next) => {
    try {
        // Populate 'appointments' using the virtual field defined in Model
        const car = await Car.findById(req.params.id).populate('appointments');

        if (!car) {
            return res.status(404).json({ 
                success: false, 
                message: `Car not found with id of ${req.params.id}` 
            });
        }

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new car
// @route   POST /api/v1/cars
// @access  Private (Admin/Provider)
exports.createCar = async (req, res, next) => {
    try {
        const car = await Car.create(req.body);
        res.status(201).json({ success: true, data: car });
    } catch (err) {
        next(err);
    }
};

// @desc    Update car
// @route   PUT /api/v1/cars/:id
// @access  Private (Admin/Provider)
exports.updateCar = async (req, res, next) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!car) {
            return res.status(404).json({ 
                success: false, 
                message: `Car not found with id of ${req.params.id}` 
            });
        }

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete car and its appointments
// @route   DELETE /api/v1/cars/:id
// @access  Private (Admin/Provider)
exports.deleteCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ 
                success: false, 
                message: `Car not found with id of ${req.params.id}` 
            });
        }

        // Cascade delete: ลบการจอง (Appointments) ทั้งหมดที่เกี่ยวข้องกับรถคันนี้
        await Appointment.deleteMany({ car: req.params.id });
        
        // ลบรถ
        await car.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};