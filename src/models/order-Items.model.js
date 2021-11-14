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
    // status: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'order',
    //     // default:'pending',
    //     // required: true
    // },
})


module.exports = mongoose.model('orderitems', orderItemsSchema);