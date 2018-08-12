const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var FB = require('fb')

class UserController {
  static registerUser(req, res){
    console.log(req.body);
    if (req.body.password === undefined || req.body.password.length === 0) {
      res.status(400).json({message: 'password is required'})
    }
    const saltUser = bcrypt.genSaltSync(8)
    const hashedPassword = bcrypt.hashSync(req.body.password, saltUser)
    User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      password: hashedPassword
    })
    .then(user=>{
      console.log(user);
      const tokenUser = jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }, process.env.JWT_SECRET_KEY)
      // console.log(tokenUser);
      let data = { token: tokenUser, userId: user._id, name: user.name, email: user.email, role: user.role }
      res.status(200).json({message: 'user successfully registered!', data})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getUsers(req, res){
    User.find({})
    .then(users=>{
      // console.log(users);
      if (users.length === 0) {
        res.status(404).json({message: 'no users found!',data: users})
      }else {
        res.status(200).json({message: 'users found!',data: users})
      }
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getOneUser(req, res){
    console.log(req.params.id);
    User.findOne({ _id: req.params.id })
    .then(user=>{
      // console.log(user);
      res.status(200).json({message: 'User successfully retrived',data: user})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static deleteUser(req, res){
    User.deleteOne({ _id: req.params.id })
    .then(result=>{
      res.status(200).json({message: 'user successfully deleted', data: result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static updateUser(req, res){
    if (req.body.password === undefined || req.body.password.length === 0) {
      res.status(400).json({message: 'password is required to update'})
    }
    const saltUser = bcrypt.genSaltSync(8)
    const hashedPassword = bcrypt.hashSync(req.body.password, saltUser)
    User.updateOne({ _id: req.params.id }, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      password: hashedPassword
    })
    .then(result=>{
      res.status(200).json({message: 'user successfully updated!', result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static login(req, res){
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
        // console.log(tokenUser);
        res.status(200).json({token: tokenUser, userId: user._id, name: user.name, email: user.email, role: user.role })
        // req.headers.token = tokenUser
      }else {
        res.status(400).json({message: 'wrong password'})
      }
    })
    .catch(err=>{
      res.status(400).json({message: 'email is not found', err})
    })
  }
  static fbLogin(req, res){
    FB.api('me', { fields: ['id', 'name', 'email', 'first_name'], access_token: `${req.headers.token}` }, function (resFb) {
      console.log('resfb------>',resFb);
      User.findOne({ email: resFb.email })
      .then(regist=>{
        console.log(regist);
        const tokenUser = jwt.sign({
          id: regist._id,
          name: regist.name,
          email: regist.email,
          role: regist.role,
        }, process.env.JWT_SECRET_KEY)
        console.log(regist);
        console.log('tokenasdasd',tokenUser);
        let objData = { token: tokenUser, userId: regist._id, email: regist.email, name: regist.name, role: user.role  }
        console.log(objData);
        res.status(200).json({message: "fb login successful!", data: { token: tokenUser, userId: regist._id, email: regist.email, name: regist.name, role: user.role  }})
        // req.headers.token = tokenUser
      })
      .catch(notRegist=>{
        const saltUser = bcrypt.genSaltSync(8)
        const hashedPassword = bcrypt.hashSync(`${resFb.first_name.toLowerCase()}123`, saltUser)
        User.create({
          name: resFb.name,
          email: resFb.email,
          password: hashedPassword
        })
        .then(user=>{
          // console.log('ini promise', user);
          const tokenUser = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }, process.env.JWT_SECRET_KEY)
          // console.log(tokenUser);
          let data = { token: tokenUser, userId: user._id, name: user.name, email: user.email, role: user.role }
          res.status(200).json({message: "fb login successful!", data})
        })
        .catch(err=>{
          res.status(400).json({message: 'email is not found', err})
        })
      })
    });
  }
}

module.exports = UserController
