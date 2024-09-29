const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// register
const register = async (req, res) => {
  const { userName, email, password } = req.body;


  try {

    const checkUser = await User.findOne({email})
    if(checkUser) return res.json({success: false, message: "Email already exists"})

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error registering",
    });
  }
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({email})
    if(!checkUser) return res.json({success: false, message: "User doen't exist. Please register"})

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if(!checkPasswordMatch) return res.json({
      success: false,
      message: "Invalid password"
    })

    const token = jwt.sign({
      id: checkUser._id, role: checkUser.role, email: checkUser.email
    }, 'CLIENT_SECRET_KEY', {expiresIn: '60m'})

    res.cookie('token', token, {httpOnly: true, secure: false}).json({
      success: true,
      message: "LoggedIn Successful",
      user:{
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id
      }
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error registering",
    });
  }
};

// logout
const logout = async (req, res) => {
  res.clearCookie('token').json({
    success: true,
    message: 'Logged out successfully'
  })
}

// middleware
const authMiddleware = async(req, res, next) =>{
  const token = req.cookies.token;
  if(!token) return res.status(401).json({
    success: false,
    message : 'Unauthorized user!'
  })

  try {
    const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
    req.user = decoded;
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }
}


module.exports = { register, login, logout, authMiddleware};
