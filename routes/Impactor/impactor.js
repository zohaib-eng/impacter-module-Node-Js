//Headers
const {User:User}=require('../student/schema');
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



//Post api to save data.config({path: '../env'}); in the database.
//This api is used to register user data in the database.

router.post('/register', async (req, res) => {
    var Uid3=uuid.v4();
    const otp = generateOTP();
  
    const user = new User({
      username: req.body.username,
      email:req.body.email,
      password:req.body.password,
      cellnumber:req.body.cellnumber,
      yid:Uid3,
      otp:otp.otp_code,
      expiration_time:otp.expiration_time,
   });
  
   userData="User Already Exist. Please Login";
   const oldUser =await User.findOne({ email:req.body.email },{new:true});
   if(oldUser) {
    return res.status(409).json({
      message : 'failed',
      status:false,
      data : {
        userData
      }
    });
    }
  
    try {
      user.save();
        
     const x=await sendMail({
          to: user.email,
          OTP:otp.otp_code,
        });
  
      let resUser = userToUserDTO(user);
  
      res.status(201).json({
        message : 'success',
        status:true,
        data : {
          resUser
        }
      });
      
    } catch (error) {
      return [false, 'Unable to sign up, Please try again later', error];
    }
    });



    //EmailVerify Api

router.post('/verifyOtp',async (req,res)=>{
    const {email,otp}=req.body;
    const nxt = await validateUserSignUp(email,otp,res);
  
   if(nxt[0])
    res.status(200).json({
      message : 'true',
      status:true,
      data : nxt[1]
    });
   else
    res.status(409).json({
      message : 'false',
      status:false,
      error : nxt[1]
    });
  
  });
  
  const validateUserSignUp=async(email,otp,res)=>{
    const user=await User.findOne({ email });
    if(!user){
      return [false,'User not found'];
    }
    
    if(user.otp !== otp || !checkOTPExpiry(user.expiration_time)){
      new_otp = generateOTP();
      
      await User.findOneAndUpdate(
        {email},
        {$set: {
          'otp': new_otp.otp_code,
          'expiration_time': new_otp.expiration_time
        }}
      )
      // call function to send email
      sendMail({
        to: user.email,
        OTP:new_otp.otp_code,
      });
      
      return [false,'Invalid OTP, New OTP share via email'];
    }
  
    const nxt = await User.findOneAndUpdate(
      {otp:user.otp},
      { $set: {"active":true} }
    );
    
    returnUser = userToUserDTO(nxt); 
    return [true, returnUser];
  };


  //Get Api is used to get user data through primary key with authorize token.

  router.get('/register/email',auth,async(req,res)=>{
    fetchemail=req.query.email;
      const data=await User.findOne({email:fetchemail})
          if(!data){
            return res.json({
              success : false,
              message:'User is not exist..'
            })
          }
          return res.json({
            success : true,
            data
          })
  });



  //Update api to change the the user data & save in database with primary key & authorize token. 

  router.put('/register/update',auth,async(req,res)=>{
    fetchemail=req.query.email;
      User.findOneAndUpdate({email:req.body.email},req.body,{new:true},function(err,val){
          if(err){
              res.send(err)
          }
          res.json({
            status : 'UPDATE Success',
            data : {
              val
            }
        })
      })
  });



  //impactor Login api 

  router.post('/login',async(req,res, next)=>{
    try{
      fetchemail=req.body.email;
      fetchpassword=req.body.password;
      const user = await User.findOne({ email:fetchemail });
      if (user && (fetchpassword==user.password)) {
        // Create token
        const token = jwt.sign(
          { id: user.id, email:user.email },
          process.env.JWT_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;
        return res.status(201).json({
          message : 'Successfully login',
          success:true,
          data : {
            user
          }
        });
      }
      const msg="invalid Credential";
      res.status(201).json({
        message : 'User does not exist',
        success:false,
        data : {
          msg
        }
      });
      }catch(err){
      console.log(err)
      }
    });


    //Delete api to delete user data in the database with primary key & authorize token.

    router.delete('/delete',auth,async(req,res)=>{
        fetchemail=req.body.email;
        const u=User.findOneAndRemove({email:req.body.email},function(err,val){
              if(err){
                  res.send(err)
              }
              res.json({message:"Data Deleted Succesfully.."});
          })
  
      });


      //Verify token api

    router.post("/welcome",auth, (req, res) => {
        res.status(200).send("Welcome 🙌 ");
        });


  function userToUserDTO(user) {
    let resUser = {};
    resUser.username = user.username;
    resUser.email = user.email;
    resUser.yid = user.yid;  
    return resUser;
  }

  module.exports=router

