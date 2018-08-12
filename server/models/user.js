const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    require: true
  },
  phone: {
    type: String,
    unique: true,
    require: true
  },
  role: {
    type: String,
    require: true,
    default: 'user'
  },
  password: {
    type: String,
    require: true
  },
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User
