const schoolTeacher = require('../model/teacherModel.js')
const bcrypt = require('bcrypt')
const { isEmailValid } = require('../utils/emailValidation');
const jwt = require("jsonwebtoken");


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
const JWT_SECRET = "myjsonsecretkey101";

async function loginSchoolTeacher(email, password) {
    const teacher = await schoolTeacher.findOne({ email });

    if (!teacher) {
        throw new Error('Teacher not found');
    }

    // Compare password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Generate a JWT token if the login is successful
    const token = jwt.sign(
        { teacher_id: teacher._id, teacher_name: teacher.full_name },  // Payload (include teacher details)
        JWT_SECRET, // Secret key to sign the token
        { expiresIn: '1h' } // Token expiration time (1 hour)
    );

    return { token, teacher };
}

module.exports = {
    loginSchoolTeacher, 
    registerSchoolTeacher
};