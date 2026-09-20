// Load environment variables FIRST
require('dotenv').config();

const app = require('./app');
const dns = require('dns');
dns.setServers(["8.8.8.8","8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const PORT = process.env.PORT || 3000;

// UncaughtException Error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

// Connect to database first
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Give database a moment to connect, then start server
setTimeout(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });

    // Unhandled Promise Rejection
    process.on('unhandledRejection', (err) => {
        console.log(`Error: ${err.message}`);
        server.close(() => {
            process.exit(1);
        });
    });
}, 1000);
