const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.registeruser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, department, position } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            department,
            position,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error.' });
}

};


// Login
exports.loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with:', email);

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('No user found.');
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            'your_jwt_secret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                department: user.department,
                position: user.position,
            
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
