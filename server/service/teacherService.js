const schoolTeacher = require('../model/teacherModel.js')
const bcrypt = require('bcrypt')

// Register a new school teacher
async function registerSchoolTeacher(full_name, identification_number, email, password, class_assigned) {
    const existing = await schoolTeacher.findOne({ identification_number });

    if (existing) {
        throw new Error("ID number already exists. Different users can't have the same ID numbers!");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeacher = new schoolTeacher({
            full_name,
            identification_number,
            email,
            password: hashedPassword,
            class_assigned
        });

        await newTeacher.save();
        return newTeacher;

    } catch (err) {
        throw new Error("Unable to save the teacher. Please try again");
    }
}


//TODO: Authentication API. 2 step authentication//
// Login teacher
async function loginSchoolTeacher(email, password) {
    const teacher = await schoolTeacher.findOne({ email });

    if (!teacher) {
        return null;
    }

    //encypt password entered to be able to compare
    const isMatch = await bcrypt.compare(password, teacher.password);
    return isMatch ? teacher : null; //???
}

module.exports = {
    registerSchoolTeacher,
    loginSchoolTeacher
};  