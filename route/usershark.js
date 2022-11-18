const express = require('express');
const bcrypt =require("bcryptjs")
const jwt=require("jsonwebtoken")
const adminAuth = require('../middleware/adminauth')
const userAuth = require('../middleware/userauth')
const usermodel = require('../models/usermodel');
const tokenmodel = require('../models/tokenmodel');

let router = express()


router.post('/user/profile/withtoken',userAuth,async(req,res)=> {
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
router.post('/user/profile/edit',userAuth, async (req, res) => { 

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