const axios = require('axios');

class ApiController {
  static getUser(req, res){
    axios.get('https://api.github.com/users/lockonmaram',{},{
      Accept: 'application/vnd.github.mercy-preview+json',
    })
    .then(user=>{
      console.log(user);
      res.status(200).json(user.data)
    })
    .catch(err=>{
      res.status(400),json('error')
    })
  }
  static search(req, res){
    console.log(req.body);
    let username = req.body.username
    axios.get(`https://api.github.com/search/users?q=${username}`,{},{
      Accept: 'application/vnd.github.mercy-preview+json',
    })
    .then(user=>{
      console.log(user);
      res.status(200).json(user.data)
    })
    .catch(err=>{
      res.status(400),json('error')
    })
  }
  static createRepo(req, res){
    let repoName = req.body.repoName
    let description = req.body.description

    axios.post(`https://api.github.com/user/repos`,{
      name: repoName,
      description: description
    },{
      headers:{
        'User-Agent': 'stringapaja',
        Authorization: `token ${process.env.TOKEN}`
      }
    })
    .then(response=>{
      res.status(200).json(response.data)
    })
    .catch(err=>{
      res.status(400),json('error')
    })
  }
}

module.exports = ApiController
