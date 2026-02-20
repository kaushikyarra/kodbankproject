require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS: allow ALL origins (file://, localhost, live server, etc.) ──────────
app.use(cors({
    origin: true,        // reflects whatever origin sent the request
    credentials: true    // allow cookies
}));

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Serve Frontend as Static Files ───────────────────────────────────────────
// Users can open http://localhost:5000/register.html etc.
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Kodbank API is running 🏦', timestamp: new Date().toISOString() });
});

// ─── Catch-all: serve register.html for unknown routes ───────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'register.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🏦 Kodbank running on http://localhost:${PORT}`);
    console.log(`📋 Register : http://localhost:${PORT}/register.html`);
    console.log(`🔑 Login    : http://localhost:${PORT}/login.html`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard.html\n`);
});
