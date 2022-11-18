const express = require('express');
const bcrypt =require("bcryptjs")
const jwt=require("jsonwebtoken")
const adminAuth = require('../middleware/adminauth')
const userAuth = require('../middleware/userauth')
const usermodel = require('../models/usermodel');
const tokenmodel = require('../models/tokenmodel');

let router = express()
router.post('/signup', async (req, res) => {
    try {
        
        var { name,username,role, email,phone,password} = req.body
        if (name == undefined || name == null) {
            res.status(200).json({
                status: false,
                msg: "name is invalid"
            })

            return;
        }

        if (typeof name!== 'string') {
            res.status(200).json({
                status: false,
                msg: "invalid datatype of name"
            })
            return;
        }
        if (username == undefined || username == null) {
            res.status(200).json({
                status: false,
                msg: "username is invalid"
            })

            return;
        }

        if (typeof username!== 'string') {
            res.status(200).json({
                status: false,
                msg: "invalid datatype of username"
            })
            return;
        }
        
        if (email == undefined || email == null) {
            res.status(200).json({
                status: false,
                msg: " email is invalid"
            })
            return;
        }

        if (typeof email !== "string") {
            res.status(200).json({
                status: false,
                msg: "invalid datatype of email"
            })
            return;
        }
        if (phone == undefined || phone == null) {
            res.status(200).json({
                status: false,
                msg: "phone is invalid"
            })
            return;
        }
        if (typeof phone !== "number") {
            res.status(200).json({
                status: false,
                msg: "invalid datatype of phone"
            })
            return;
        }
        if (password == undefined || password == null) {
            res.status(200).json({
                status: false,
                msg: "password is invalid"
            })
            return; 
        }
        if (typeof password!== "string") {
            res.status(200).json({
                status: false,
                msg: "invalid datatype of password"
            })
            return;
        }
        var alreadyexists =await usermodel.findOne({phone:phone})
        console.log(alreadyexists)
            if(alreadyexists!=null || alreadyexists!=undefined){
                
                res.status(200).json({
                    status:false,
                    msg:"phoneNumber already exists"
                })
                return;
            }
            var  encpass=await bcrypt.hash(password,10);
            var data=new usermodel();
        data.name=name;
        data.username=username;
        data.role=role;
        data.email=email;
        data.phone=phone;
        data.password=encpass;
        await data.save();
        console.log(data)
        res.status(200).json
            ({
                status: true,
                data:data


            })
            
        return;
    }
    catch (e) {
        console.log(e);
    }
});

router.post('/login',async(req,res)=>{
   
    try{
        var {Phone,Password}= req.body

        var user = await usermodel.findOne({phone:Phone})
        if(user==null || user == undefined){
            res.status(200).json({
                status:false,
                msg:"invalid credentials"
            })
            return;
        }
        if(await bcrypt.compare(Password,user.password)){
            var token =jwt.sign({user:user},"key");
            var tokenData= new tokenmodel();
            tokenData.userId= user._id;
            tokenData.token= token;
            await tokenData.save()
            return  res.status(200).json({
                status:true,
                msg:"Login Successful",
                token:tokenData
            })

            
        }else{
            return res.status(200).json({
                status:false,
                msg:"Password is wrong!!!"
            })
        }
       
    }catch(error){
        return console.log(error);
    }
    
})

router.post('/profile/withtoken',adminAuth,async(req,res)=> {
    try{
        var userid = req.user.user._id;
        var userprofile = await usermodel.findOne({_id : userid})
            
            res.status(200).json({
                status:true,
                output:userprofile
        })
        return;
    }     

catch(e)
{
    console.log(e)
}
})
router.post('/profile/edit',adminAuth, async (req, res) => { 

    try {
        var { name, email, id} = req.body;
        if (id == null || id == undefined) {
            res.status(200).json({
                status: false,
                msg: "id not given "
            })
            return;
        }

        var profileexists = await eventmodel.findOne({ _id: id})
        if (profileexists == null || undefined) {
            res.status(200).json({
                status: false,
                msg: "profile doesn't exist in database "
            })
            return;
        }
        if(name!=null||name!=undefined){
            profileexists.name=name
        }
        if(email!=null||email!=undefined){
            profileexists.email=email
        }
        await profileexists.save()

        res.status(200).json
                (
                    {
                        status: true,
                        output: eventexists
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
        res.status(200).json({
            status:false,
            error:e
        })
    }
})
module.exports = router;