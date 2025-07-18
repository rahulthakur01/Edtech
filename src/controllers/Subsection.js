const Section = require("../models/Section");
const subSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description, sectionId } = req.body;
    const video = req.files.videoFile;
    //validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_FILE
    );
    // create subsection
    const subSectionDetails = await subSection.create({
      title: title,
      imeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    //update section with this sub section ObjectId
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetails.id,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      succcess: true,
      message: "Sub Section Created Successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
