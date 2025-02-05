// Cors
require('dotenv').config();

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_CLOUD_URL
        : process.env.FRONTEND_LOCAL_URL,  
    // origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie']
};
// Cookie

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'? 'none' : 'lax',
    maxAge: 24*60*60*1000,
    path: '/',
    domain: process.env.NODE_ENV === 'production'? '.vercel.app' : 'localhost'
};

module.exports = {corsOptions, cookieOptions};
