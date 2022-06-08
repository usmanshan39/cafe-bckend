const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


// signup api
router.get('',(req,res)=>{
    return res.status(200).json({message:'here'});
});

router.post('/signup' , (req, res) =>{
    let user = req.body;
    query = "select email , password , role , status from users where email =?"
    connection.query(query , [user.email], (err , results)=>{
        if(!err){
            if(results.length <= 0){
                query = "insert into users (name , contactNumber , email , password , status , role)values(? ,? , ? , ? , 'false' , 'user')";
                connection.query(query , [user.name , user.contactNumber , user.email , user.password], (err , results)=>{
                    if(!err){
                        return res.status(200).json({status:true,message:'Successfully Signup'});
                    }
                    else{
                        return res.status(500).json(err);
                    }
                });
            }
            else{
                return res.status(400).json({status:false,message:'Email is Already Exist!'});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.post('/login' , (req , res)=>{
    const user = req.body;
    query = "select email , password, role, status from users where email =?";
    connection.query(query , [user.email] , (err , results)=>{
        if(!err){
            if(results.length <=0 || results[0].password != user.password){
                return res.status(401).json({status:false, message:'Incorrect Username or Password'});
            }
            else if(results[0].status === 'false'){
                return res.status(401).json({status:false,message:"Wait For Admin Approvel"});
            }
            else if(results[0].password == user.password){
                const response = {email:results[0].email , role:results[0].role};
                const accessToken = jwt.sign(response , process.env.ACCESS_TOKEN, {expiresIn:'8h'});
                res.status(200).json({status:true, message:"User Login Successfully", token:accessToken});
            }
            else{
                return res.status(400).json({status:false, message:"Something Went Wrong"});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})


var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'usmanshan339@gmail.com',
        pass: 'lpwryhoaniosmkvd'
    }
});

// forgot password

router.post('/forgotPassword', (req, res)=>{
    const user = req.body;
    query = "select email, password from users where email=?";
    connection.query(query , [user.email], (err , results)=>{
        if(!err){
            if(results.length <= 0){
                return res.status(200).json({status:true, message:'Password sent successfully to your email'});
            }
            else{
                var mailOptions = {
                    from :process.env.EMAIL,
                    to: results[0].email,
                    subject:'Password by Cafe Management',
                    html:'<p><b>Your loin Details is</b><br>Email:<b>'+results[0].email+'</b><br>Password:<b>'+results[0].password+'</b><br><a href="http://localhost:4200/">Login</a></p>'
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log('email sent '+ info.response);
                    }
                });
                return res.status(200).json({status:true, message:'Password sent successfully to your email'});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
});


// ger all users

router.get('/get', auth.authenticateToken, checkRole.checkRole,  (req , res) =>{
    var query = 'select id , name , contactNumber , status from users where role = "user"';
    connection.query(query , (err , results)=>{
        if(!err){
            return res.status(200).json({status:true,users:results});
        }
        else{
            return res.status(500).json({status:false,message:err});
        }
    })
});

// update user status

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req , res)=>{
    let user = req.body;
    var query = 'update users set status=? where id=?';
    connection.query(query, [user.status, user.id], (err, results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({status:false, message:'User id is not exist'});
            }
            else{
                return res.status(200).json({status:true, message:'User Updated Successfully'});
            }
        }
        else{
            return res.status(500).json({status:false,message:err});
        }
    })
});

// for check token

router.get('/checkToken', (req, res)=>{
    return res.status(200).json({status:true,message:'true'});
})


// change password

router.post('/changePassword', auth.authenticateToken ,(req, res)=>{
    const user = req.body;
    const email = res.locals.email;
    var query = "select * from users where email =? and password=?";
    connection.query(query , [email, user.oldPassword], (err, results)=>{
        if(!err){
            if(results.length<=0){
                return res.status(400).json({status:false,message:'Incorrect Old Password'});
            }
            else if(results[0].password == user.oldPassword){
                query = "update users set password=? where email=?";
                connection.query(query, [user.newPassword , email], (err, results)=>{
                    if(!err){
                        return res.status(200).json({status:true, message:'Password Updated Successfully'});
                    }
                    else{
                        return res.status(500).json({status:false,message:err});
                    }
                })
            }
            else{
                return res.status(400).json({status:false, message:'Something went wrong'});
            }
        }   
        else{
            return res.status(500).json(err);
        }
    });
})


module.exports = router;