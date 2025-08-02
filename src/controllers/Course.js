const course = require("../models/Courses");
const User = require("../models/User");
const Tag = require("../models/Tag");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
// create course
exports.createCourse = async (req, res) => {
  try {
    // fetch data

    const {
      courseName,
      instructor,
      whatYouWillLearn,
      courseDescription,
      tag,
      price,
    } = req.body;
    // getthumbnail
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !tag ||
      !price ||
      !whatYouWillLearn ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, Please fill all fields",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById({ userId });
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }
    // check given tag is valid or not
    const tagDetails = await Tag.findById({ tag });
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }
    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FLODER_NAME
    );
    // create entry for new courses
    const newCourse = await course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.image.url,
    });

    //add the new course to the user schema of Instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "failed to create course",
    });
  }
};

//getAllCourse
exports.getAllCourses = async (req, res) => {
  try {
    const allCourse = await course.findOne({});
    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourse,
    });
   } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can not fetch all data",
    });
  }
};
