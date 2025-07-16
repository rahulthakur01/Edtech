const course = require("../models/Courses");
const User = require("../models/User");
const Tag = require("../models/Tag");
// create course
exports.createCourse = async (req, res) => {
    // fetch data
    const { courseName, instructor, whatYouWillLearn, courseDescription, tag, price } = req.body;
    // getthumbnail
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (!courseName || !courseDescription || !tag || !price || !whatYouWillLearn || !thumbnail) {
        return res.status(400).json({
            success: false,
            message:"All fields are required, Please fill all fields"
        })
    }
    
  // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById({ userId });
    if (!instructorDetails) {
        return res.status(404).json({
            success: false,
            message: "Instructor details not found",
        })
    }
  // check given tag is valid or not
    const tagDetails = await Tag.findById({ tag });
    if (!tagDetails) {
        return res.status(404).json({
            success: false,
            message: "Instructor details not found",
        })
    }
  // upload image to cloudinary
  // create entry for new courses
  //add the new course to the user schema of Instructor
  //return response
};
