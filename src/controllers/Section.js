const Section = require('../models/Section');
const Course = require('../models/Courses');

// create section
exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;
        // validate
       if (!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing properties",
            })
        }
        // create new section
        const newSection = await Section.create({ sectionName });
        // update course with section objectId
        const updatedCourseDetails = await Course.findByIdUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            { new: true }
        )
        // return response
        return res.status(200).json({
            success: true,
            message: 'Section created successfully',
            updatedCourseDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create Section, please try again",
            error: error.message,
        });
    }
}

// updateSection
exports.updateSection = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}