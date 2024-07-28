let chai = require('chai');
let chaiHttp=require('chai-http');
const { response } = require('express');
const router = require('../routes/student/apis');
let server=require('../main');
let should = chai.should();
const config = process.env;
let mongoose = require("mongoose");
const expect = require('chai').expect;
const request = require("supertest");
const user=require("../routes/student/schema");
const { User } = require('../routes/student/schema');
const { Payment } = require('../routes/student/schema');
var fs = require('fs');
chai.use(chaiHttp);

describe("/routes/student/apis.js", () =>{
    beforeEach(async () =>{
        await User.deleteMany({});
    });

    describe("Post/Api", ()=>{
        it("it should create and return a user", async ()=>{
            let data ={
                username:"zohaib",
                email:"ChZohaib123@outlook.com",
                password:"123456",
            }
    
            let res= chai.request(server)
            .post('/register')
            .send(data)
            .end((err,res)=>{
                // fs.writeFileSync( "logtest.txt", JSON.stringify({err,res},null,2) )
                res.should.have.status(200);
                expect(res.status).to.be.eq(201);

            })
            
        })
    })



    describe("POST /login", ()=>{
        it("Should return a token and user information", async()=>{
            
            let data = {
                username:"zohaib",
                email:"ChZohaib123@outlook.com",
                password:"123456",
            }

            await chai.request(server)
            .post('/register')
            .send(data); //depends on above [signup].

            data = {
                email:"ChZohaib123@outlook.com",
                password:"123456", // correct pass
            }

            let res = await chai.request(server).post('/login').send(data);

            expect(res.status).to.be.eq(201);
            expect(res.body).to.have.property("token");
            
        })
        it("Should return error if wrong pass / email provided", async()=>{
            let data = {
                username:"zohaib",
                email:"ChZohaib123@outlook.com",
                password:"123456",
            };
            await chai.request(server).post('/register').send(data); //depends on above [Signup].

            data = {
                email:"ChZohaib123@outlook.com",
                password:"123456454",//wrong pass
            }

            let res = await chai.request(server).post('/login').send(data);
            expect(res.status).to.be.eq(201);
            
        })
    })




//get api

    describe("/Get/api", ()=>{
        it("Should return a user profile", async()=>{
            let data = {
                username:"zohaib",
                email:"ChZohaib123@outlook.com",
                password:"123456",
            };

            await chai.request(server).post('/register').send(data); //depends on above [Signup].

            data = {
                email:"ChZohaib123@outlook.com",
                password:"123456",
            }
            let res = await chai.request(server).post('/login').send(data); //depends on above [Login].

            let token = res.body.token;

            res = await chai.request(server).get('/register/email').set('x-access-token', + token)
            
            expect(res.status).to.be.eq(201);
        })

        it("Should require authorization", async ()=>{
            res = await chai.request(server).get('register/email').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
        })
    })

    describe("Get /:email", () =>{
        it("should return a user if valid email is passed", async ()=>{
            const user = new User({
                username:"zohaib",
                email:"ChZohaib123@outlook.com",
                password:"123456",
                otp:"70986",
                expiration_time:"1667670213298"
            })
            let savedUser = await user.save();
            const res = await chai.request(server).get("/routes/student/apis.js" + savedUser.email);

            res.should.have.status(200);
        })

        it("should return 400 error when invalid object id is provided", async ()=>{
            const res = await chai.request(server).get("/routes/student/apis.js");
            expect(res.status).to.be.eq(400);
            
        })

        it("should return 404 error when valid object id is provided but does not exist.", async ()=>{
            const res = await chai.request(server).get("/routes/student/apis.js");
            expect(res.status).to.be.eq(404);
        })
    })

    //update api

    describe("/Update/api", ()=>{
        it("Should return a user profile", async()=>{
            let data = {
                username:"zohaib",
                email:"ChZohaib123@outlook.com",
                password:"123456",
            };
            await chai.request(server).post('/register').send(data); //depends on above [Signup].
            data = {
                email:"ChZohaib123@outlook.com",
                password:"123456",
            }
            let res = await chai.request(server).post('/login').send(data); //depends on above [Login].
            let token = res.body.token;
            res = await chai.request(server).put('/register/email').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
        })

        it("Should require authorization", async ()=>{
            res = await chai.request(server).put('register/email').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
        })
    })

    describe("Update /:email", () =>{
        it("should return a user if valid email is passed", async ()=>{
            const user = new User({
                username:"zohaib",
                email:"ChZohaib123@outlook.com",
                password:"123456",
                otp:"70986",
                expiration_time:"1667670213298"
            })
            let savedUser = await user.save();
            const res = await chai.request(server).get("/routes/student/apis.js" + savedUser.email);

            res.should.have.status(200);
        })

        it("should return 400 error when invalid object id is provided", async ()=>{
            const res = await chai.request(server).put("/routes/student/apis.js");
            // res.should.have.status(200);
            expect(res.status).to.be.eq(400);
        })

        it("should return 404 error when valid object id is provided but does not exist.", async ()=>{
            const res = await chai.request(server).put("/routes/student/apis.js");
            expect(res.status).to.be.eq(404);
        })
    })


    //delete api


    describe("/Delete/api", ()=>{
        it("Should return a user profile", async()=>{
            let data = {
                username:"zohaib",
                email:"ChZohaib123@outlook.com",
                password:"123456",
            };
            await chai.request(server).post('/register').send(data); //depends on above [Signup].
            data = {
                email:"ChZohaib123@outlook.com",
                password:"123456",
            }
            let res = await chai.request(server).post('/login').send(data); //depends on above [Login].
            let token = res.body.token;
            res = await chai.request(server).delete('/register/email').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
        })

        it("Should require authorization", async ()=>{
            res = await chai.request(server).delete('register/email').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
        })
    })

    describe("Delete /:email", () =>{
        it("should return a user if valid email is passed", async ()=>{
            const user = new User({
                username:"zohaib",
                email:"ChZohaib123@outlook.com",
                password:"123456",
                otp:"70986",
                expiration_time:"1667670213298"
            })
            let savedUser = await user.save();
            const res = await chai.request(server).get("/routes/student/apis.js" + savedUser.email);

            res.should.have.status(200);
        })

        it("should return 400 error when invalid object id is provided", async ()=>{
            const res = await chai.request(server).delete("/routes/student/apis.js");
            expect(res.status).to.be.eq(400);
        })
        it("should return 404 error when valid object id is provided but does not exist.", async ()=>{
            const res = await chai.request(server).delete("/routes/student/apis.js");
            expect(res.status).to.be.eq(404);
        })
    })


},)

describe("/routes/student/apis.js", () =>{
    beforeEach(async () =>{
        await Payment.deleteMany({});
    });

    
    //Add Account 


    describe("AddAccount/Api", ()=>{
        it("it should create and return a account number", async ()=>{
            let data ={
                accountholder:"Asghar",
                accountnumber:"00004543436568100"
            }
            let res= chai.request(server)
            .post('/addaccount')
            .send(data)
            .end((err,res)=>{
                res.should.have.status(200);
                expect(res.status).to.be.eq(201);
            })
            
        })
    })

    //total credit balance

    describe("/totalcreditbalance/api", ()=>{
        it("Should return a user account", async()=>{
            let data = {
                accountnumber:"0000454534332390",
                mimbalance:"300"
            };
            await chai.request(server).post('/addaccount').send(data); //depends on above [Signup].
            data = {
                accountnumber:"0000454534332390",
                mimbalance:"300"
            }
            let res = await chai.request(server).post('/totalcreditbalance').send(data); //depends on above [Login].
            let token = res.body.token;
            res = await chai.request(server).post('/totalcreditbalance').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
            // expect(res.body.user).to.have.property("firstName", data.firstName);
        })

        it("Should require authorization", async ()=>{
            res = await chai.request(server).post('/totalcreditbalance').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
        })
    })

    describe("totalcreditbalance/:accountnumber", () =>{
        it("should return a user if valid account number is passed", async ()=>{
            const user = new User({
                accountholder:"Asghar",
                accountnumber:"00004543436568100"
            })
            let savedUser = await user.save();
            const res = await chai.request(server).post("/routes/student/apis.js" + savedUser.email);

            res.should.have.status(200);
        })

        it("should return 400 error when invalid object id is provided", async ()=>{
            const res = await chai.request(server).post("/routes/student/apis.js");
            expect(res.status).to.be.eq(400);
            
        })

        it("should return 404 error when valid object id is provided but does not exist.", async ()=>{
            const res = await chai.request(server).post("/routes/student/apis.js");
            expect(res.status).to.be.eq(404);
        })
    })

    //credit balance

    describe("/creditbalance/api", ()=>{
        it("Should return a user account", async()=>{
            let data = {
                accountnumber:"0000454534332390",
                deposite:"100"
            };
            await chai.request(server).post('/creditbalance').send(data); //depends on above [Signup].
            data = {
                accountnumber:"0000454534332390",
                deposite:"100"
            }
            let res = await chai.request(server).post('/login').send(data); //depends on above [Login].
            let token = res.body.token;
            res = await chai.request(server).put('/creditbalance').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
            // expect(res.body.user).to.have.property("firstName", data.firstName);
        })
        it("Should require authorization", async ()=>{
            res = await chai.request(server).put('/creditbalance').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
        })
    })

    describe("creditbalance/:accountnumber", () =>{
        it("should return a user if valid account number is passed", async ()=>{
            const user = new User({
                accountnumber:"0000454534332390",
                deposite:"100"
            })
            let savedUser = await user.save();
            const res = await chai.request(server).post("/routes/student/apis.js" + savedUser.email);
            res.should.have.status(200);
        })

        it("should return 400 error when invalid object id is provided", async ()=>{
            const res = await chai.request(server).put("/routes/student/apis.js");
            expect(res.status).to.be.eq(400);
            
        })

        it("should return 404 error when valid object id is provided but does not exist.", async ()=>{
            const res = await chai.request(server).put("/routes/student/apis.js");
            expect(res.status).to.be.eq(404);
        })
    })

    //debit balance

    describe("/debitbalance/api", ()=>{
        it("Should return a user account", async()=>{
            let data = {
                accountnumber:"0000454534332390",
                withdraw:"1000"
            };
            await chai.request(server).post('/debitbalance').send(data); //depends on above [Signup].
            data = {
                accountnumber:"0000454534332390",
                withdraw:"1000"
            }
            let res = await chai.request(server).post('/debitbalance').send(data); //depends on above [Login].
            let token = res.body.token;
            res = await chai.request(server).put('/debitbalance').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
            // expect(res.body.user).to.have.property("firstName", data.firstName);
        })

        it("Should require authorization", async ()=>{
            res = await chai.request(server).put('/debitbalance').set('x-access-token', + token)
            expect(res.status).to.be.eq(201);
        })
    })

    describe("debitbalance/:accountnumber", () =>{
        it("should return a user if valid account number is passed", async ()=>{
            const user = new User({
                accountnumber:"0000454534332390",
                withdraw:"1000"
            })
            let savedUser = await user.save();
            const res = await chai.request(server).post("/routes/student/apis.js" + savedUser.email);
            res.should.have.status(200);
        })

        it("should return 400 error when invalid object id is provided", async ()=>{
            const res = await chai.request(server).put("/routes/student/apis.js");
            // res.should.have.status(200);
            expect(res.status).to.be.eq(400);
            
        })

        it("should return 404 error when valid object id is provided but does not exist.", async ()=>{
            const res = await chai.request(server).put("/routes/student/apis.js");
            expect(res.status).to.be.eq(404);
        })
    })
    

})