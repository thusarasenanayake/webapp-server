require('dotenv').config();
module.exports = {
    port:process.env.PORT || 4041,
    mongoUri: process.env.MONGO_URL,
};