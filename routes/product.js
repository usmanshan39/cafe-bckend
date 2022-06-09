const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

// add product

router.post('/add', auth.authenticateToken , checkRole.checkRole , (req,res)=>{
    let product = req.body;
    var query = "insert into product (name, categoryId, description, price, status)values(?, ? , ? , ? , 'true')";
    connection.query(query, [product.name , product.categoryId, product.description, product.price], (err, results)=>{
        if(!err){
            return res.status(200).json({status:true, message:"Product addedd Successfully"});
        }
        else{
            return res.status(500).json({status:false, message:err});
        }
    })
});


// get products

router.get('/get', auth.authenticateToken , (req, res, next)=>{
    var query = "select p.id, p.name , p.description , p.price , p.status , c.id as categoryId , c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id ";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json({status:true, products:results});
        }
        else{
            return res.status(500).json({status:false,message:err});
        }
    })
});

// getByCaterogyID

router.get('/getByCategory/:id', auth.authenticateToken, (req, res)=>{
    const id = req.params.id;
    var query = "select id, name from product where categoryId = ? and status = 'true'";
    connection.query(query, [id], (err, results)=>{
        if(!err){
            return res.status(200).json({status:true, products:results});
        }
        else{
            return res.status(500),json({status:false,message:err});
        }
    });
});


// get by product id


router.get('/getById/:id', auth.authenticateToken, (req, res)=>{
    const id = req.params.id;
    var query = "select id, name, description, price from product where id=?";
    connection.query(query, [id], (err, results)=>{
        if(!err){
            return res.status(200).json({status:true, product:results[0]});
        }
        else{
            return res.status(500).json({status:false,message:err});
        }
    })
});


// update product

router.patch('/update', auth.authenticateToken, checkRole.checkRole , (req,res)=>{
    let product = req.body;
    var query = "update product set name =? , categoryId=? , description=? , price=? where id=?";
    connection.query(query , [product.name, product.categoryId, product.description, product.price , product.id], (err, results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({status:false,message:"Product Id Dose Not Found"});
            }
            return res.status(200).json({status:true, message:"Product updated Successfully"});
        }
        else{
            return res.status(500).json({status:false,message:err});
        }
    })
});


// delete Product

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole , (req, res)=>{
    const id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query,[id], (err, results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({status:false, message:"Product Id is not valid"});
            }
            return res.status(200).json({status:true,message:"Product Deleted Successfully"});
        }
        else{
            return res.status(500).json({status:false, message:err});
        }
    })
});


// update product status


router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole , (req,res, next)=>{
    let product = req.body;
    var query = "update product set status =? where id=?";
    connection.query(query , [product.status, product.id], (err, results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({status:false, message:"Invalid Product id"});
            }
            return res.status(200).json({status:true, message:"Product Status Updated Successfully"});
        }
        else{
            return res.status(500).json({status:false, message:err});
        }
    })
})


module.exports = router;