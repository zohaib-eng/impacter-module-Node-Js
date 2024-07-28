//Mongoose
const { unique } = require("@hapi/joi/lib/types/array");
const mongoose =  require("mongoose");
const { Schema } = mongoose;


//Models 1
//User Schema

const personSchema = new Schema({
 
  active: {
    type: Boolean,
    default:true,
    required: true,
    min: 15,
    max: 50
  },  
  username: {
      type: String,
      required: true,
      min: 15,
      max: 50
    },
    email: {
      type: String,
      required: true,
      min: 5,
      max: 255,
      unique:true
    },
    cellnumber: {
      type: String,
      required: true,
      min: 15,
      max: 50
    },
    password: {
      type: String,
      required: true,
      min: 5,
      max: 1024
    },
    otp: {
      type: String,
      required: true,
      index:{expires:'2m'}
    },
    expiration_time: {
      type: String,
      required:true
  },
    yid: { 
      type: String,
      required: true,
    },
    token: { type: String },
  });
  const User = mongoose.model("persons", personSchema);


  //Model 2
  //Payment schema

  const paymentSchema = new Schema({
  
    accountholder: { 
      type:String,
      required:true,
      min:0,
      max:255,
    },
    accountnumber: {
      type: String,
      required: true,
      min: 0,
      max: 255,
      unique:true
    },
    email: {
      type: String,
      required: true,
      min: 5,
      max: 255,
    },
    // otp: {
    //   type: String,
    //   required: true,
    //   index:{expires:'2m'}
    // },
    mimbalance: {
      type: Number,
      required: true,
      min: 0,
      max: 1024
    },
    withdraw: {
      type: Number,
      required: true,
      min: 0,
      max: 1024
    },
    deposite: {
      type: Number,
      required: true,
      min: 0,
      max: 1024
    },
    gift: {
      type: String,
      required: false,
      min: 0,
      max: 1024
    },
    companyshare: {
      type: Number,
      required: true,
      min: 0,
      max: 1024
    },
    impactei: {
      type: String,
      required: false,
      min: 0,
      max: 1024
    },
    date: {
      type: Date,
      default:function(){
      return Date.now();
    }},
    });
    const Payment = mongoose.model("payments", paymentSchema);


  //Models 3
  //addImpactee schema

const addImpacteeSchema = new Schema({
  
  // success: {
  //   type: String,
  //   default:true,
  //   required: true,
  //   min: 15,
  //   max: 50
  // }, 
  ProfileImage: {
    type: String,
    require:false,
    default: 0
  },
  Vid: {
    type: String,
    required: false,
  },
  name: {
      type: String,
      required: false,
      min: 1,
      max: 50
    },
    tid: {
      type: String,
      required: false,
      index:{expires:'2m'}
    },
    cnic: {
      type: String,
      required: false,
      min: 1,
      max: 50,
      unique:true
    },
    email: {
      type: String,
      required: false,
      min: 1,
      max: 255
    },
    DOB: {
      type: String,
      required: false,
      min: 1,
      max: 1024
    },
    spouse  : {
      type: String,
      required: false,
      min: 1,
      max: 1024
    },
    address: {
      type: String,
      required: false,
      min: 1,
      max: 1024
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    parentId: {
      type: String,
      required: false,
    },
    gift:{
      type:String,
      require:false
    }
});
  const Impact = mongoose.model("AddImpactee", addImpacteeSchema);



//Model 4 Supplier Schema

const SupplierSchema = new Schema({
  name:{
    type:String,
    require:false,
  },
  cnic:{
    type:String,
    require:false,
  },
  contact:{
    type:String,
    require:false,
  },
  publiccontact:{
    type:String,
    require:false
  },
  accountno:{
    type:String,
    require:false,
  },
  email: {
    type: String,
    required: false,
    min: 5,
    max: 255,
    unique:true
  },
  password:{
    type:String,
    require:false
  },
  newpassword:{
    type:String,
    require:false
  },
  AccountNumber:{
    type:String,
    require:false
  },
  otp: {
    type: String,
    required: false,
    index:{expires:'2m'}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  uid:  {
    type: String, 
    required: false
    },

  stationname:{
    type:String,
    require:false,
    
  },
  province:{
    type:String,
    require:false,
    
  },
  area:{
    type:String,
    require:false,
    
  },
  city:{
    type:String,
    require:false,
    
  },
  stationaddress:{
    type:String,
    require:false,
    
  },
    token: { type: String },
  });
  const Supp= mongoose.model("addsupplier",SupplierSchema);



  //Model 5
  //Fuel Station


  const FuelSchema = new Schema({
    stationname:{
      type:String,
      require:true,
    },
    province:{
      type:String,
      require:true,
      unique:true
    },
    city:{
      type:String,
      require:true,
    },
    area: {
      type: String,
      required: true,
      min: 5,
      max: 255,
    },
    stationaddress:{
      type:String,
      require:true
    }, 
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    fid:  {
      type: String, 
      required: true
      },
    });
    const Station= mongoose.model("fuelstation",FuelSchema);
  module.exports = { Impact:Impact,User:User,Payment:Payment,Supp:Supp,Station:Station};