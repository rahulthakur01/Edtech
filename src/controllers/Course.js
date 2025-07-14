const course = require("../models/Courses");

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
  // check given tag is valid or not
  // upload image to cloudinary
  // create entry for new courses
  //add the new course to the user schema of Instructor
  //return response
};
