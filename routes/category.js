const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

// insert category
router.post('/add', auth.authenticateToken , checkRole.checkRole , (req, res , next)=>{
    let category = req.body;
    query = "INSERT INTO category (name) values(?)";
    connection.query(query , [category.name], (err, results)=>{
        if(!err){
            return res.status(200).json({status:true, message:'Category Added Successfully'});
        }
        else{
            return res.status(500).json({status:false, message:err});
        }
    })
});


// get all categories

router.get('/get', auth.authenticateToken , (req, res, next)=>{
    var query = "select * from category";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json({status:true, categories:results});
        }
        else{
            return res.status(500).json({status:false, message:err});
        }
    })
});


// update category


router.patch('/update', auth.authenticateToken , checkRole.checkRole , (req, res, next)=>{
    let product = req.body;
    var query = "update category set name=? where id=?";
    connection.query(query, [product.name , product.id], (err, results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({status:false, message:"Category Id dose not found"});
            }
            return res.status(200).json({status:true, message:"Category Updated Succesfully"})
        }
        else{
            return res.status(500).json({status:false, message:err});
        }
    })
});


module.exports = router;