const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new student
// @route   POST /api/register
// @access  Public
const registerStudent = async (req, res) => {
    try {
        const { name, email, password, course } = req.body;

        if (!name || !email || !password || !course) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if student exists
        const studentExists = await Student.findOne({ email });

        if (studentExists) {
            return res.status(400).json({ message: 'Student with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create student
        const student = await Student.create({
            name,
            email,
            password: hashedPassword,
            course
        });

        if (student) {
            res.status(201).json({
                _id: student.id,
                name: student.name,
                email: student.email,
                course: student.course,
                token: generateToken(student._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid student data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate a student
// @route   POST /api/login
// @access  Public
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check for student email
        const student = await Student.findOne({ email });

        if (student && (await bcrypt.compare(password, student.password))) {
            res.json({
                _id: student.id,
                name: student.name,
                email: student.email,
                course: student.course,
                token: generateToken(student._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update student password
// @route   PUT /api/update-password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide old and new password' });
        }

        const student = await Student.findById(req.studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, student.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(newPassword, salt);
        await student.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update student course
// @route   PUT /api/update-course
// @access  Private
const updateCourse = async (req, res) => {
    try {
        const { course } = req.body;

        if (!course) {
            return res.status(400).json({ message: 'Please provide a course' });
        }

        const student = await Student.findById(req.studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.course = course;
        await student.save();

        res.json({
            _id: student.id,
            name: student.name,
            email: student.email,
            course: student.course,
            message: 'Course updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get student profile
// @route   GET /api/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const student = await Student.findById(req.studentId).select('-password');
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    registerStudent,
    loginStudent,
    updatePassword,
    updateCourse,
    getMe
};
