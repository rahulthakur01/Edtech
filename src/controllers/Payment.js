const User = require("../models/User");
const Course = require("../models/Courses")
const { instance } = require("../config/razorpay");
const Razorpay = require("razorpay");

// create capture and initate Razorpay order
exports.capturePyament = async (req, res) => {
    
    // get id 
    const { course_id } = req.body;
    const userId = req.user.id;

    if (!course_id) {
        return res.json({
            success: false,
            message: "Please provide valid course id",
        })
    }
    // valid courseDetails
    let course
    try {
        course = await Course.findById(course_id);
        if (!course) {
            return res.json({
                success: false,
                message: "Could not find course id ",
            })
        }

        // check if user is already purchase course 
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.include(uid)) {
            return res.status(200).json({
                success: false,
                message:"User already purchase the course or already enrolled",
            })
        }

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }

    // create order
    const amount = course.price;
    const currency = "INR";
    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: course_id,
            userId,
        }
    }
    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription:course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        })
        
    } catch(error) {
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }
}