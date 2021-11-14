const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    passwordHash: {
        type: String,
    },
    houseNo: {
        type: Number,
    },
    streetName: {
        type: String,
    },
    city: {
        type: String,
    },
    phoneNo: {
        type: Number,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    status:{
        type: String,
        default: "Active"
    }
},
    {timestamps: true}
);
customerSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
customerSchema.set('toJSON',{
    virtual: true,
});

module.exports = mongoose.model("customer", customerSchema)