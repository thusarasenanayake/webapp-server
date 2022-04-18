require('dotenv').config();
module.exports = {
    port:process.env.PORT || 4041,
    mongoUri: process.env.MONGO_URL,
    sendEmailAddress: process.env.EMAIL,
    sendEmailPassword: process.env.EMAIL_PASSWORD,
};