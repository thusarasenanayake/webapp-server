const mongoose = require('mongoose');

const orderItemsSchema = mongoose.Schema({
    quantity: {
        type: Number,
        require: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
})


module.exports = mongoose.model('orderitems', orderItemsSchema);