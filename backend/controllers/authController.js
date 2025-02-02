const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const cookieOptions = require('../cors')

exports.register = async (req, res) => {
    const { firstName, surName, dateOfBirth, gender, emailId, password } = req.body;
  
    if (!firstName || !surName || !dateOfBirth || !gender || !emailId || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists!' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        firstName,
        surName,
        dateOfBirth,
        gender,
        emailId,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      const token = jwt.sign(
        { userID: newUser._id, email: newUser.emailId }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );
  
      res.cookie('token', token, cookieOptions);
      res.json({ 
        message: 'User Registered Successfully!', 
        token, 
        user: {
          firstName: newUser.firstName,
          surName: newUser.surName,
          emailId: newUser.emailId,
          dateOfBirth: newUser.dateOfBirth,
          gender: newUser.gender
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

//   Login
  
  exports.login = async (req, res) => {
    const { emailId, password } = req.body;
  
    try {
      const user = await User.findOne({ emailId });
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign(
        { userID: user._id, email: user.emailId }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );
  
      res.cookie('token', token, cookieOptions);
      res.json({ 
        message: 'Login Successful!', 
        token, 
        user: {
          firstName: user.firstName,
          surName: user.surName,
          emailId: user.emailId,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  exports.logout = (req, res) => {
    res.clearCookie('token', {
      ...cookieOptions,
      maxAge: 0
    });
    res.status(200).json({ message: 'Logged out successfully' });
  };
  