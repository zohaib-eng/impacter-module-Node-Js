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
var file = require('file-system');
var fs = require('fs');
const DIR='./';
const multer=require('multer');
const fileupload=require('../student/fileupload');
const {generateOTP, checkOTPExpiry}=require('../services/otp');
const {sendMAIL, sendMail}=require('../services/mail');
const uuid = require('uuid');




router.post('/addImpactee',fileupload(),auth, async (req, res) => {
    const Uid=uuid.v4();
    //const Uid2=uuid.v1();
    var g=new Payment();
    var n=g.otp;
    let payload=req.body;
    var imgurl="";
    if(req.file){
      imgurl=`storage/images/${req.file.filename}`;
      payload.avatar=imgurl;
    }

    const impact = new Impact({
      ProfileImage:`storage/images/${req.file.filename}`,
      Vid:Uid,
      name:req.body.name,
      cnic:req.body.cnic,
      email:req.body.email,
      DOB:req.body.DOB,
      spouse:req.body.spouse,
      address:req.body.address,
      parentId:req.body.parentId,
      tid:n
   });
   const impactUser =await Impact.findOne({ cnic:req.body.cnic },{new:true});
   if(impactUser) {
      return res.status(201).json({
        success : false,
        message : "Impactee Already Exist"
        });
    }
    res.status(201).json({
      success : true,
      message:"Impactee created",
      data:impact
      });
    impact.save();
    });



//impactee tid email

    router.get('/impacteetIdEmail',auth,async(req,res,next)=>{
        const otp = generateOTP();
        const ks=await Impact.findOne({email:req.query.email});
        if(!ks){
          res.status(201).json({
            success : false,
            message:"Impactee Invalid",
          });
        }
        try{
          sendMail({
            to: ks.email,
            OTP:otp.otp_code,
          });
        
        const cv=await Impact.findOneAndUpdate(
          {email:req.query.email},
          {$set:{'tid':otp.otp_code}}
          )
  
        const df=await Impact.findOne({email:req.query.email});
        if(df){
          return res.status(201).json({
            success : true,
            message:"Impactee",
            df
          });
        }
        }
        catch{
  
        }
      })


//Get Api is used to get impactees list data through primary key with authorize token.
    
router.get('/impacteeList',auth,async(req,res,next)=>{
    Impact.find({},function(err,impact){
        if(err){
          return res.send(err);
        }
        return res.status(201).json({
          success : true,
          message:"Impactee List",
          data : impact
      })
    })
});


//Get Api is used to get impactees list on the base of Add Impactee id through primary key with authorize token.

router.get('/impacteeIdList',auth,async(req,res,next)=>{
    const{parentId}=req.query;
    Impact.find({parentId:{$in:[parentId]}},function(err,impact){
      if(err){
        return res.send(err);
      }
      return res.status(201).json({
        success : true,
        message:"Impactee List",
        data : impact
    })
    })
  })


  //enter amount 

router.put('/enteramount',auth,async(req,res)=>{
    new_otp = generateOTP();
    const lk=await Impact.findOneAndUpdate(
      {email:req.body.email},
      {$set:{'gift':req.body.gift}}
      )
      sendMail({
        to: lk.email,
        OTP:new_otp.otp_code,
      });
    const yu=await Impact.findOneAndUpdate(
      {email:req.body.email},
      {$set:{'tid':new_otp.otp_code}}
      )
    const data=await Impact.findOne({email:req.body.email});
      if(data){
        return res.status(201).json({
          success : true,
          data
      })
      }
  })



  //gift expire

router.post('/giftexpire',auth,async(req,res)=>{
    const data=await Impact.updateOne({email:req.body.email},{$unset:{'tid':req.body.tid}})
    if(data){
      return res.status(201).json({
        success : true,
        data
    })
  }
  })


  //compare tid to get response impactee

router.post('/tidcompare',auth,async(req,res)=>{
    const data=await Impact.findOne({tid:req.body.tid});
    if(!data){
      return res.status(201).json({
        success:false,
        message:"failed compare",
      })
    }
    return res.status(201).json({
      success:true,
      message:"successfully compare",
      data
    })
  })




module.exports=router