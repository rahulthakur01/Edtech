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
        // data fetch
        const { sectionName, sectionId } = req.body;
        // validate
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message:"Missing properties",
            })

        }
        // update
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
        // return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: section,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Unable to update section, Please try again"
        })
    }
}
// Delete Section

exports.deleteSection = async (req, res) => {
    try {
        // extract from here router.delete("/section/:sectionId", deleteSection);
        // DELETE /section/64f7a7129aa3e12a7a...
        // this is sectionId 64f7a7129aa3e12a7a
        const { sectionId } = req.params;
        const { courseId } = req.body;
        await Section.findByIdAndDelete(sectionId);
        // if section is linked with course, delete reference from courseSchema
        await Course.findByIdAndDelete(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        })
        // return response
        return res.status(200).json({
            success: true,
            message:"Section deleted successfully"
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete Section, please try again",
            error: error.message,
        });
    }
    
}