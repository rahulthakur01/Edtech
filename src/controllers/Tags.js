const Tag = require("../models/Tag");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.staus(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // entery in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create tag, Please try again",
      message: error.message,
    });
  }
};

// GetallTag handler
exports.getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All tags returned successfully",
      allTags,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create tag, Please try again",
      message: error.message,
    });
  }
};
