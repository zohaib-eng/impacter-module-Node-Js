//Headers
const {Impact:Impact}=require('../student/schema');
const {Payment}=require('../student/schema');
var express = require('express');
const { response } = require('express');
const bodyParser = require('body-parser');
const router= express.Router();
const jwt=require('jsonwebtoken');
const { json } = require('body-parser');
const { token } = require('morgan');
const auth = require("../student/auth");
// const auth2 = require("./auth2");
var file = require('file-system');
var fs = require('fs');
const DIR='./';
const {generateOTP, checkOTPExpiry}=require('../services/otp');
const {sendMAIL, sendMail}=require('../services/mail');
const uuid = require('uuid');



      //Add account Api in the database

      router.post('/addaccount',async(req,res,next)=>{
        var a=req.body.mimbalance;
        a=0;
        var b=req.body.withdraw;
        b=0;
        var c=req.body.deposite;
        c=0;
        var d=req.body.companyshare
        d=0;
        const pay=new Payment({
          accountholder:req.body.accountholder,
          accountnumber:req.body.accountnumber,
          mimbalance:a,
          withdraw:b,
          deposite:c,
          companyshare:d,
          email:req.body.email
        });
        paydata="Account Holder Already Exist. Please create new account..";
        var t=pay.email;
        const data=await Payment.findOne({accountnumber:req.body.accountnumber});
        if(data){
          return res.status(201).json({
            success:false,
            status : false,
            message:"Account created failed..",
            pay
          });
        }
        pay.save();
        // const rt=await User.findOne({$lookup:{from: "User",localField: "email",foreignField: "username",as: "email"}});
        return res.status(201).json({
          success:true,
          status : true,
          message:"Account created..",
          pay
        });
  
          // pay.save();
    });


      //Total Credit Balance Api;

  router.post('/totalcreditbalance',async(req,res)=>{
    const{accountnumber,mimbalance}=req.body;
    const pay2 = await validatemimbalance(accountnumber,mimbalance,res);
    res.send(pay2);
});

const validatemimbalance=async(accountnumber,mimbalance,req)=>{
  const pay=await Payment.findOne({accountnumber});
  if(!pay){
    return [false,'Invalid account number'];
  }
  if(mimbalance!==mimbalance){
    return [false,'Invalid Mim Balance'];
  }
  const oldRecord=await Payment.findOne({accountnumber:accountnumber});
  var e,f;
  f=parseFloat( parseFloat(mimbalance) + parseFloat(oldRecord.mimbalance))
  const nxt2=await Payment.findOneAndUpdate(
    {accountnumber},
    {$set: {'mimbalance': f}}
  )
  const nxt7=await Payment.findOne({accountnumber:accountnumber});
        return nxt7;
}


//Credit Balance api.

router.put('/creditbalance',async(req,res,next)=>{
    const{accountnumber,deposite}=req.body;
      const pay3 = await Payment.findOne({accountnumber:accountnumber});
      if(!pay3){
        return res.status(201).json({
          success:false,
          message:"Account number is invalid.."
      })
      }
      
      const oldRecord2=await Payment.findOne({accountnumber:accountnumber});
      var g;
      g=parseFloat( parseFloat(deposite) + parseFloat(oldRecord2.mimbalance))
      const nxt3=await Payment.findOneAndUpdate(
          {accountnumber},
          {$set: {'mimbalance': g,'deposite':deposite}}
      )
      const data=await Payment.findOne({accountnumber:accountnumber});
      if(data){
        return res.status(201).json({
          success:true,
          data
      })
      }
      return res.status(201).json({
        success:false,
      })
  })


  //Debit balance api

router.put('/debitbalance',async(req,res,next)=>{
    const{accountnumber,withdraw}=req.body;
      const pay4 = await Payment.findOne({accountnumber:accountnumber});
      if(!pay4){
        return res.status(201).json({
          success:false,
          message:"Account number is invalid.."
      })
      }
      var e,f;
      e=10.25*parseFloat(withdraw)/100
      companyshare=e
      f=withdraw-e
      mimbalance=pay4.mimbalance-f
      const nxt4=await Payment.findOneAndUpdate(
          {accountnumber},
            {$set: {'mimbalance': mimbalance,'withdraw':withdraw,'companyshare':companyshare}}     
      )
      const data=await Payment.findOne({accountnumber:accountnumber});
      if(data){
        return res.status(201).json({
          success:true,
          data
      })
      }
  })

// get payment data
  router.get('/checkbalance',async(req,res,next)=>{
    Payment.findOne(({accountnumber:req.query.accountnumber}),function(err,data){
        if(err){
          res.send(err);
        }
        return res.status(201).json({
          success : true,
          data 
      })
    })
  });


    //gift cutting

router.post('/amountcutbalance',async(req,res,next)=>{
    var c=new Impact();
    const{email,gift}=req.body;
    const x1="Email is invalid..";
      const pay4 = await Payment.findOne({email:email});
      if(!pay4){
        return res.status(201).json({
          success : false,
          x1
      })
      }
      var e,f;
      e=10.25*parseFloat(gift)/100
      companyshare=e
      f=gift-e
      mimbalance=pay4.mimbalance-gift
      const nxt4=await Payment.findOneAndUpdate(
          {email},
            {$set: {'mimbalance': mimbalance,'gift':gift,'companyshare':companyshare,'impactei':f}}     
      )
      const data=await Payment.findOne({email:email});
      if(data){
        return res.status(201).json({
          success : true,
          data
      })
      }
  })




    module.exports=router