//Headers
const {User:User, Station}=require('./schema');
const {Impact:Impact}=require('./schema');
const {Supp:Supp}=require('./schema');
const {FuelSchema:FuelSchema}=require('./schema');
const {Payment}=require('./schema');
var express = require('express');
const { response } = require('express');
const bodyParser = require('body-parser');
const router= express.Router();
const jwt=require('jsonwebtoken');
const { json } = require('body-parser');
const { token } = require('morgan');
const auth = require("./auth");
const auth2 = require("./auth2");
var file = require('file-system');
var fs = require('fs');
const DIR='./';
const multer=require('multer');
const fileupload=require('./fileupload');
const {generateOTP, checkOTPExpiry}=require('../services/otp');
const {sendMAIL, sendMail}=require('../services/mail');
const uuid = require('uuid');



const imp=require('../impactee/impactee-apis')
const sup=require('../Supplier/supplier-api')
const pay=require('../Payment/payment-api')
const impactor=require('../Impactor/impactor')


router.use(impactor)
router.use(pay)
router.use(imp)
router.use(sup)

module.exports = router


// email to mim balance
//processing------------------------------------------------------

// router.post('/impacteeTIDbill',async(req,res)=>{
//   const otp = generateOTP();
//   const im=new Impact();
//   const em=await Payment.findOne({accountnumber:req.body.accountnumber});
//   //var b=em.otp;
//   im.tid=otp.otp_code;
//   if(em){
//    sendMail({
//       to: em.email,
//       OTP:otp.otp_code,
//     });
    
//     const g=await Impact.findOneAndUpdate(
//       {Vid:req.body.Vid},
//       {$set:{'tid':otp.otp_code}},
//       {$upsert:true}
//       )
//       // return g;
//      const k=await Impact.findOne({Vid:req.body.Vid});
//      if(k){
//       return res.status(201).json({
//         success : true,
//         k
//       })
//     }
//     // return res.status(201).json({
//     //   success : true,
//     //   g
//     // })
//   }
// })
// return res.status(201).json({
//   success : false,
//   message:"No Account is available"
// })






