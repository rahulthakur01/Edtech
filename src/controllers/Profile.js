const Profile = require("../models/Profile");
const User = require("../models/User");
exports.updateProfile = async () => {
    try {
        const { dateOfBirth = " ", about = "", contactNumber, gender } = req.body;

        const id = req.user.id;

        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        // find profile
        const userDetails = await User.findById(id);
        const profileId =  userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // insert details in profiledetails
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;

        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile date successfully",
            profileDetails,
        })

    }catch(error) {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
}

// Delete account
exports.deleteAccount = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}