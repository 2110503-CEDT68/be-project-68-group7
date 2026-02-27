const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: [true, 'Please add a license plate'],
        unique: true, // Ensures no two cars have the same plate
        trim: true,
        uppercase: true, // Standardizes plates to uppercase
        maxlength: [15, 'License plate cannot be more than 15 characters']
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand (e.g., Toyota, Tesla)'],
        trim: true
    },
    model: {
        type: String,
        required: [true, 'Please add a model (e.g., Camry, Model 3)'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Please add the manufacturing year']
    },
    color: {
        type: String,
        required: [true, 'Please add the car color']
    },
    transmission: {
        type: String,
        enum: ['Automatic', 'Manual'],
        required: [true, 'Please specify the transmission type']
    },
    fuelType: {
        type: String,
        enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid'],
        default: 'Gasoline'
    },
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'Provider',
        required: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Virtual populate to see all appointments for this specific car
carSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'car',
    justOne: false
});

module.exports = mongoose.model('Car', carSchema);