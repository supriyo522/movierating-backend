const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).send('User created successfully');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
      }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found');
    
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid password');
    
        const accessToken = jwt.sign({ username: user.username, email: user.email }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
      }
};
