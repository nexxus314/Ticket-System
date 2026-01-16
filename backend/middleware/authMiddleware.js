const jwt = require("jsonwebtoken");

function authMiddleware (req,res,next){

    console.log("auth middleware is workinggggggggggggggggggggggggggggg")
    const authHeader = req.headers.authorization;
    console.log("Auth header:",authHeader)
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"No token provided"});
    }

    const token = authHeader.split(" ")[1]

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(err){

        return res.status(401).json({message:"Invalid TToken"})
    }
}

module.exports = authMiddleware;