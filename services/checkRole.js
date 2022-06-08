require('dotenv').config();

function checkRole(req, res, next){
    if(res.locals.role == process.env.USER)
    res.status(401).json({status:false,message:'Only Admin Can Access This'});
    else
    next()
}

module.exports = {checkRole:checkRole}