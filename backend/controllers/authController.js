const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const { cookieOptions } = require('../cors');

const userFile = './users.json';

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

        fs.readFile(userFile, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    data = '[]';
                } else {
                    return res.status(500).json({ message: 'Failed to read users file' });
                }
            }

            const users = JSON.parse(data);
            users.push({
                firstName: newUser.firstName,
                surName: newUser.surName,
                emailId: newUser.emailId,
                dateOfBirth: newUser.dateOfBirth,
                gender: newUser.gender,
            });

            fs.writeFile(userFile, JSON.stringify(users, null, 2), (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ message: 'Failed to save user data' });
                }

                const token = jwt.sign(
                    { userID: newUser._id, email: newUser.emailId },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.cookie('token', token, cookieOptions);
                res.status(201).json({
                    message: 'User Registered Successfully!',
                    token,
                    user: {
                        firstName: newUser.firstName,
                        surName: newUser.surName,
                        emailId: newUser.emailId,
                        dateOfBirth: newUser.dateOfBirth,
                        gender: newUser.gender
                    },
                });
            });
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
      const user = await User.findOne({ emailId });
      if (!user) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
          { userID: user._id, email: user.emailId },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
      );

      const cookieOptions = {
          httpOnly: false, 
          secure: false,   
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000, 
          path: '/',
      };

      console.log('Setting cookie with token:', token);
      console.log('Cookie options:', cookieOptions);

      res.cookie('token', token, cookieOptions);

      res.set({
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Expose-Headers': 'Set-Cookie'
      });

      return res.json({
          status: 'success',
          message: 'Login successful!',
          token,
          user: {
              firstName: user.firstName,
              surName: user.surName,
              emailId: user.emailId,
              dateOfBirth: user.dateOfBirth,
              gender: user.gender,
          },
      });
  } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};