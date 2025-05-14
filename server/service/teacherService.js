const schoolTeacher = require('../model/teacherModel.js')
const bcrypt = require('bcrypt')
const { isEmailValid } = require('../utils/emailValidation');


// Register a new school teacher
async function registerSchoolTeacher(full_name, identification_number, email, password, class_assigned) {
    const existing = await schoolTeacher.findOne({ identification_number });

    if (existing) {
        throw new Error("ID number already exists. Different users can't have the same ID numbers!");
    }

    //checking for email, if disposable or not
     const emailValid = await isEmailValid(email);
     if (!emailValid) {
         throw new Error("Invalid or disposable email address. Please use a valid email.");
     }

    try {
        //passowrd encryption using bcrypt.
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
    console.log("Server.teacherService,js: Looking up teacher with email:", email);  // Log email being queried
    const teacher = await schoolTeacher.findOne({ email });

    if (!teacher) {
        console.log("No teacher found with that email");  // Log if no teacher is found
        return null;
    }

    console.log("Teacher found:", teacher);  // Log the teacher object found in DB

    // Compare the entered password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, teacher.password);

    console.log(isMatch ? "Password matched" : "Password did not match");  // Log password comparison result

    return isMatch ? teacher : null;  // Return teacher if credentials match, otherwise null
}

module.exports = {
    registerSchoolTeacher,
    loginSchoolTeacher
};  