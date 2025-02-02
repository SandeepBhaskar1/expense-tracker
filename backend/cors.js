// Cors
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'? 
    'https://cloud-link' :
    'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders:['Content-Type', 'Authorization', 'Cookie']
};

// Cookie

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'? 'none' : 'lax',
    maxAge: 24*60*60*1000,
    domain: process.env.NODE_ENV === 'production'? '.vercel.app' : 'localhost'
};

module.exports = {corsOptions, cookieOptions};
