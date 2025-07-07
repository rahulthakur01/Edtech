const OTP = require('../models/OTP');
const User = require('../models/User')
const otpgenerator = require('otp-generator');
// send otp
exports.sendOTP = async (req, res) => {
    try {
        
        const { email } = req.body;

        const checkUserPresent = await findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already registerd'
            })
        }
        // OTP Generate
        var otp  = otpgenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false, 
            specialChars: false,
        });
        console.log("OTP generated", otp);

        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpgenerator(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false, 
                specialChars: false,
            })
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);
        res.status(200).json({
            success: false,
            message:" OTP sent successfully",
            otp,
        })

    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Authentication
// Signup

exports.signUp = async (req, res) => {
    try {
        // data fetch from req ki body
        const { firstName, lastName, password, confirmPassword, accountType, otp } = req.body;

        // Validation
        if (!firstName || !lastName || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',

            })
        }
        // Match password
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirmPassword do not match, Please try again",

            })
        }
        // check if user already exits
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User is already registered',
            })
        }
        // Find most recent otp for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        // validate otp
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Otp not found",

            })
        } else if (otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid otp",
            })
        }
        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Entry in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateofBirth: null,
            about: null,
            contactNumber: null,
        })
        
        const user = await user.create({
            firstName, 
            lastName, 
            email,
            password: hashPassword,
            accountType,
            additionalDetails: profileDetails_id,
        })

        return res.status(200).json({
            success:true,
            message:'User is registered Successfully',
            user,
        });

    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({
            success: false,
            message: 'User can not be registered, Please try again',
        })
    }
}
