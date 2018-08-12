const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class indexController {
  static signUp(req, res){
    const saltUser = bcrypt.genSaltSync(8)
    const hashedPassword = bcrypt.hashSync(req.body.password, saltUser)
    console.log(req.body);
    User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      password: hashedPassword,
      salt: saltUser
    })
    .then(user=>{
      const tokenUser = jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }, process.env.JWT_SECRET_KEY)
      console.log(tokenUser);
      res.status(200).json({token: tokenUser, userId: user._id, name: user.name, email: user.email, role: user.role })
    })
  }
  static signIn(req, res){
    User.findOne({ email: req.body.email})
    .then(user => {
      const passwordCheck = bcrypt.compareSync(req.body.password, user.password)
      // console.log(user.password);
      // console.log(passwordCheck);
      if (passwordCheck) {
        const tokenUser = jwt.sign({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }, process.env.JWT_SECRET_KEY)
        console.log(tokenUser);
        res.status(200).json({token: tokenUser, userId: user._id, name: user.name, email: user.email, role: user.role })
        // req.headers.token = tokenUser
      }else {
        res.status(200).json('wrong password')
      }
    })
    .catch(err=>{
      res.status(200).json('email is not found')
    })
  }
}

module.exports = indexController
