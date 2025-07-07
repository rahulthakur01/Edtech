const OTP = require('../models/OTP');

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
        

    } catch (error) {
        
    }
}


