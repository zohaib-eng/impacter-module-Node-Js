// const otpGenerator = require('otp-generator');
const date = require('@hapi/joi/lib/types/date');
const { now } = require('mongoose');
var random = require('random-string-alphanumeric-generator');
const { OTP_LENGTH }=require('../../constants');

module.exports.generateOTP=()=>{
    const otp_code = random.randomNumber(OTP_LENGTH);
    const expiration_time = addMinutesToDate(new Date(),1);

    return {otp_code, expiration_time};
};

module.exports.checkOTPExpiry = (otp_expiry_time) => {
    if(new Date().getTime()<=parseInt(otp_expiry_time))
        return true;

    return false;
};


function addMinutesToDate(date, minutes) {
    return (date.getTime() + (minutes * 60 * 1000));
}