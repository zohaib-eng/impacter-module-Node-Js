//Headers
const {Supp:Supp}=require('../student/schema');
var express = require('express');
const { response } = require('express');
const bodyParser = require('body-parser');
const router= express.Router();
const jwt=require('jsonwebtoken');
const { json } = require('body-parser');
const { token } = require('morgan');
const auth2 = require("../student/auth2");
var file = require('file-system');
var fs = require('fs');
const DIR='./';
const {generateOTP, checkOTPExpiry}=require('../services/otp');
const {sendMAIL, sendMail}=require('../services/mail');
const uuid = require('uuid');




    //Add Supplier Api

    router.post('/AddSupplier',async(req,res)=>{
        const otp = generateOTP();
        // const v = jwt.sign(
        //   process.env.JWT_KEY,
        // );
        var c=uuid.v4();
        var t=Supp.contact
        const supp = new Supp({
          name:req.body.name,
          cnic:req.body.cnic,
          contact:req.body.contact,
          email:req.body.email,
          password:req.body.password,
          otp:otp.otp_code,
          AccountNumber:t,
          //token:v,
          uid:c
        })
        const old_supplier = await Supp.findOne({email:req.body.email });
        if(old_supplier) {
          return res.status(201).json({
            success : false,
            message : "Supplier Already Exist"
            });
        }
        try{
          supp.save();
          const x=await sendMail({
            to: supp.email,
            OTP:otp.otp_code,
          });
        let resSupplier = suppToSupplierDTO(supp);
    
          res.status(201).json({
            success : true,
            message:"Supplier created",
            data:resSupplier
            });
          // supp.save();
        }
        catch (error){
          return res.status(201).json({
            success : false,
            message : "Unable to SignUp please try again later",error
            });
        }
      });


      //get supplier data

      router.get('/getsupplier',auth2,async(req,res)=>{
        const data=await Supp.findOne({email:req.query.email});
        if(data){
          return res.status(201).json({
            success : true,
            message : "Success",
            data
          });
        }
        return res.status(201).json({
          success : false,
          message : "Invalid Supplier",
        });
      })



        //update supplier
        //processing

  router.put('/supplier/update',auth2,async(req,res)=>{
    fetchemail=req.body.email;
    cellnumber=req.body.cellnumber
     const df=await Supp.findOneAndUpdate({email:req.body.email},req.body,{new:true});
     if(!df){
      return res.status(201).json({
        success : false,
        message : "Updated failed.."
        });
     }
     const gh=await Supp.findOneAndUpdate(
      {email:req.body.email},
      {$set:{'cellnumber':cellnumber}}
      )
      const data=await Supp.findOne({email:req.body.email});
      if(data){
        return res.status(201).json({
          success : true,
          message : "Updated Success..",
          data
        });
      }
      return res.status(201).json({
        success : false,
        message : "Supplier not found..",
        });
  });


    ////FuelStation Api

    router.put('/registerStep3', auth2,async (req, res) => {
       const data1 =await Supp.findOneAndUpdate(
        {email:req.body.email},
        {$set:{stationname:req.body.stationname,province:req.body.province,city:req.body.city,area:req.body.area,stationaddress:req.body.stationaddress,publiccontact:req.body.publiccontact}},
        {$upsert:true}
        );
        const data=await Supp.findOne({email:req.body.email});
       if(!data) {
          return res.status(201).json({
            success : false,
            message : "Station Already Exist"
          });
        }
        return res.status(201).json({
          success : true,
          message:"Station Successfully updated",
          data
          });
        });



        //two fields update supplier

    
  router.put('/updatesuppliertwo',auth2, async (req, res) => {
   const data1 =await Supp.findOneAndUpdate(
    {email:req.body.email},
    {$set:{stationname:req.body.stationname,publiccontact:req.body.publiccontact}},
    {$upsert:true}
    );
    const data=await Supp.findOne({email:req.body.email});
   if(!data) {
      return res.status(201).json({
        success : false,
        message : "Station Already Exist"
      });
    }
    return res.status(201).json({
      success : true,
      message:"Station Successfully updated",
      data
      });
    });


      //storeinfo api

  router.put('/storeinformation',auth2,async(req,res)=>{
    const us = new Supp({
      name:req.body.name,
      contact:req.body.contact,
      email:req.body.email,
      AccountNumber:req.body.AccountNumber,
    })
    Supp.findOneAndUpdate({contact:req.body.contact},req.body,{new:true},function(err,val){
      if(err){
          res.send(err)
      }
      return res.json({
        status:true,
        message : 'Success',
        val
      })
  })
  })


    //Supplier Login

    router.post('/SupplierLogin',async(req,res)=>{
        try{
          fetchEmail =req.body.email;
          fetchpassword=req.body.password;
          const data = await Supp.findOne({email:fetchEmail});
          if (data && (fetchpassword==data.password)) {
            // Create token
            const token = jwt.sign(
              { id:data.id,email:data.email },
              process.env.JWT_KEY,
              {
                expiresIn: "2h",
              }
            );
            // save user token
            data.token = token;
            return res.status(201).json({
              message : 'Successfully Login',
              success:true,
              data
              
              
            });
          }
          const msg="invalid Credential";
            res.status(201).json({
            message : 'false',
            status:false,
            data : {
              msg
            }
          });
        }catch(err){
          console.log(err)
        }
      });

    //otp Supplier login final

    router.post('/SupOtpLogin',async(req,res)=>{
        try{
          fetchEmail =req.body.email;
          fetchotp=req.body.otp;
          const data = await Supp.findOne({email:fetchEmail});
          if (data && (fetchotp==data.otp)) {
            // Create token
            const token = jwt.sign(
              { id:data.id,email:data.email },
              process.env.JWT_KEY,
              {
                expiresIn: "2h",
              }
            );
            // save user token
            data.token = token;
            return res.status(201).json({
              message : 'Successfully Login',
              success:true,
              data
            });
          }
          const msg="invalid Credential";
            res.status(201).json({
            message : 'false',
            status:false,
            data : {
              msg
            }
          });
        }catch(err){
        
        }
      });


    //supplier otp login

 router.post('/SupplierSendOtpLogin',auth2,async(req,res)=>{
    try{
      email =req.body.email;
      const suplog = await Supp.findOne({email:email});
      if (suplog) {
        // Create otp
        new_otp = generateOTP();
        
        await Supp.findOneAndUpdate(
          {email},
          {$set: {
            'otp': new_otp.otp_code,
            'expiration_time': new_otp.expiration_time
          }}
        )
        // call function to send email
        sendMail({
          to: suplog.email,
          OTP:new_otp.otp_code,
        });
      }
      const data=await Supp.findOne({email:email});
      if(data){
        return res.status(201).json({
          success : true,
          message:"Otp send successfully",
          data
        });
      }
    }catch(err){
      console.log(err)
    }
  }); 


    //suplier compare otp login 
    router.post('/compareSuppOtp',auth2,async(req,res)=>{
        try{
          otp=req.body.otp;
          const data = await Supp.findOne({otp:otp});
          if (data) {
            return res.status(201).json({
              success:true,
              message : 'otp verified',
              data
            });
          }
          
          return res.status(201).json({
            success:false,
            message : 'otp not true',
          });
        }catch(err){
          console.log(err)
        }
      }); 


      //otp compare again signup Supplier

    router.post('/SignUpOtp',auth2,async(req,res)=>{
    try{
      //var sup=new Supp();
      otp=req.body.otp;
      const data = await Supp.findOne({otp:otp});
      let resotpSupplier=suppToSupplier(data)
      if (data) {
        return res.status(201).json({
          success:true,
          message : 'otp verified',
          data:resotpSupplier
        });
      }
      
      return res.status(201).json({
        success:false,
        message : 'otp not true',
      });
    }catch(err){
      console.log(err)
    }
  }); 


    //forgot otp email

    router.post('/otpforgotpasemail',auth2,async(req,res)=>{
        const otp = generateOTP();
        const yi=await Supp.findOne({email:req.query.email});
        if(!yi){
          return res.status(201).json({
            success : false,
            message : "Otp invalid.."
          });
        }
        const x=await sendMail({
          to: yi.email,
          OTP:otp.otp_code,
        });
        const yt=await Supp.findOneAndUpdate(
          {email:req.query.email},
          {$set:{'otp':otp.otp_code}}
          )
        const data=await Supp.findOne({email:req.query.email});
        if(data){
          return res.status(201).json({
            success : true,
            message : "Otp Forgot Successfully",
            data
          });
        }
        return res.status(201).json({
          success : false,
          message : "Invalid Credential..",
        });
      })


      //forgot password otp compare 
    router.post('/pasFGotpCompare',auth2,async(req,res)=>{
    const data=await Supp.findOne({otp:req.body.otp});
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


  
  //forgot password

    router.put('/forgotpassword',auth2,async(req,res)=>{
    try{
      const pass = new Supp({
        //Email:req.body.Email,
        newpassword:req.body.newpassword,
      })
      let b=pass.newpassword;
      const p=await Supp.findOneAndUpdate(
        {email:req.body.email,},
        {$set: {'password': b}}     
    )
      if(p){
        return res.status(201).json({
          success : true,
          message : "Password changed.."
        });
      }
      return res.status(201).json({
        success : false,
        message : "Password not changed.."
      });
    }
    catch(err){
      console.log(err);
    }
  })

  //reset password

  router.post('/resetpassword',auth2,async(req,res)=>{
    try{
      const pass = new Supp({
        password:req.body.password,
        newpassword:req.body.newpassword,
      })
      const p=await Supp.findOne({password:req.body.password});
      if(!p) {
        return res.status(201).json({
          success : false,
          message : "Password does not match.."
          });
      }
      var l=pass.newpassword
      const x=await Supp.findOneAndUpdate(
        {password:req.body.password},
        {$set:{'password':l}}
      )
      const data=await Supp.findOne({password:l});
      if(data){
        return res.status(201).json({
          success : true,
          message:"Password changed successfully",
          data
      })
      }
      return res.status(201).json({
        status : 'Success',
        x
      })
    }
    catch{

    }
  })




      function suppToSupplierDTO(supp) {
        let resSupplier = {};
        resSupplier.name = supp.name;
        resSupplier.cnic = supp.cnic;
        resSupplier.contact = supp.contact;
        resSupplier.email = supp.email;
        resSupplier.uid=supp.uid;
        return resSupplier;
      }

      function suppToSupplier(data) {
        let resotpSupplier = {};
        resotpSupplier.name = data.name;
        resotpSupplier.cnic = data.cnic;
        resotpSupplier.contact = data.contact;
        resotpSupplier.email = data.email;
        return resotpSupplier;
      }


module.exports=router