const RatingAndReviews = require("../models/RatingAndReviews");
const mongoose = require("mongoose");
const Course = require("../models/Courses");

//=========Create Rating

exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    // check if user enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }
    // check if user already reviewed the course

    const alreadyReviewed = await RatingAndReviews.findOne({
      user: userId,
      courseId: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course already reviewed by user",
      });
    }
    // create rating and review
    const ratingReview = await RatingAndReviews.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // Update course with rating and review
    const updateCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );
    // respnse
    return res.status(200).json({
      success: true,
      message: "rating and reviewd successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//=========Get Average Review

exports.getAverageReview = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    const result = await RatingAndReviews.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    // if rating and review exit
    return res.status(200).json({
      success: true,
      message: "Average Rating is 0, no ratings given till now",
      averageRating: 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//=========getAllReviewAndRating
exports.getAllRatingAndReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReviews.findOne({})
                                                    .sort({ rating: "desc" })
                                                    .populate({
                                                        path: "user",
                                                        select: "firstName LastName email image",
                                                    })
                                                    .populate({
                                                        path: "course",
                                                        select: "courseName",
                                                    })
                                                    .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
