const User = require('../models/User');
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.cookie.token || req.body.token || req.header("Authorisaton").replace("Bearer", "");

        // check token valid or not
        if (!token) {
            return res.status(401).json({
                success: false,
                message:"Token missing",
            })
        }
        
        // agar token aa gaya to verify karo
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch (error) {
            // verification issue
            console.log("error", error);
            
            return res.status(401).json({
                success: false,
                message: "token is invalid",
            })
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

// check if it isStudent

exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message:"This is proctected route for Student only"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"user role cannot be verified, Please try again",
        })
    }
}

// check if it isInstructor

exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message:"This is proctected route for Instructor only"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"user role cannot be verified, Please try again",
        })
    }
}
// check if it isAdmin

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message:"This is proctected route for Admin only"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"user role cannot be verified, Please try again",
        })
    }
}