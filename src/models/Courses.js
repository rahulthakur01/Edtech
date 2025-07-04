const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({

    courseName: {
        type: String,
    },
    courseDescription: {
        type: String,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
    },

    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref :"Section",
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref :"RatingAndReviews"
        }
    ],
    price: {
        type: Numeber,
    },
    thubmnail: {
        type: String,
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    },
    studentEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }],

})
module.exports = mongoose.Schema("Course", courseSchema);