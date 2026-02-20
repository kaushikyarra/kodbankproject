const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────
const register = async (req, res) => {
    try {
        const { uid, username, email, password, phone } = req.body;

        if (!uid || !username || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Check if uid or username or email already exists
        const [existing] = await db.query(
            'SELECT uid FROM KodUser WHERE uid = ? OR username = ? OR email = ?',
            [uid, username, email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'User with this UID, username, or email already exists.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // uid is INT in DB — parse it
        const uidInt = parseInt(uid);
        if (isNaN(uidInt)) {
            return res.status(400).json({ success: false, message: 'User ID must be a number.' });
        }

        // Insert user — role is always Customer, balance starts at 100000
        await db.query(
            'INSERT INTO KodUser (uid, username, email, password, phone, role, balance) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uidInt, username, email, hashedPassword, phone, 'Customer', 100000]
        );

        return res.status(201).json({ success: true, message: 'Registration successful! Please login.' });
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required.' });
        }

        // Find user
        const [users] = await db.query(
            'SELECT uid, username, email, password, role, balance FROM KodUser WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        // Generate JWT
        const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
        const token = jwt.sign(
            { sub: user.username, role: user.role, uid: user.uid },
            process.env.JWT_SECRET,
            { expiresIn }
        );

        // Calculate expiry date for DB
        const expairy = new Date();
        expairy.setHours(expairy.getHours() + 24);

        // Store token in UserToken table — column is 'expairy' (as in actual DB)
        await db.query(
            'INSERT INTO UserToken (token, uid, expairy) VALUES (?, ?, ?)',
            [token, user.uid, expairy]
        );

        // Set httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,        // false for localhost dev
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            user: { username: user.username, role: user.role }
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};

// ─────────────────────────────────────────────
// CHECK BALANCE (Protected)
// ─────────────────────────────────────────────
const checkBalance = async (req, res) => {
    try {
        const username = req.user.sub;

        const [users] = await db.query(
            'SELECT balance, username FROM KodUser WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            balance: users[0].balance,
            username: users[0].username
        });
    } catch (error) {
        console.error('Check Balance Error:', error);
        return res.status(500).json({ success: false, message: 'Server error fetching balance.' });
    }
};

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
const logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// ─────────────────────────────────────────────
// GET ME
// ─────────────────────────────────────────────
const getMe = (req, res) => {
    return res.status(200).json({
        success: true,
        user: { username: req.user.sub, role: req.user.role }
    });
};

module.exports = { register, login, checkBalance, logout, getMe };
