require('dotenv').config();
module.exports={
allowedOrigins: ['http://0.0.0.0:5000/'],
SERVER_PORT: process.env.PORT || 5000,
OTP_LENGTH:5,
MAIL_SETTINGS:{
    service:'Outlook',
    auth:{
        user:process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD
    }
}

}