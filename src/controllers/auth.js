const OTP = require('../models/OTP');
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
        console.log(otpbody);
        res.status(200).json({
            success: false,
            message:" OTP sent successfully",
            otp
        })

    } catch (error) {
        
    }
}


