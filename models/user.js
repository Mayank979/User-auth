const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema(
 {
  username : {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength:6
  },
  email: {
    type: String,
    trim: true,
    minlenght:1,
    unique:true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
 }
);

/// anything added to methods is instance method

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email', 'username'])
}

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = "auth";
  var token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();

  user.tokens.push({access, token});
  return user.save()
            .then(() => {
              return token;
            });
};

/// anything added to statics is model method

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, "abc123");
  } catch (e) {
      // return new Promise((resolve, reject) => {
      //   reject();
      // });
      return Promise.reject();
  }

   return User.findOne({
     '_id': decoded._id,
     'tokens.token' : token,
     'tokens.access' : "auth"
   });
};


// Mogoose middleware   !!!!   runs some code before an event

// 1 param is the event 2param next is imp, tells to go next
UserSchema.pre("save", function (next) {
    var user = this;

    // ismodified takes a propertyand returns bool value
    //we want to encrypt the password only if its modified

    if(user.isModified("password")) {
      let salt_rounds = 10;
        bcrypt.genSalt(salt_rounds, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) =>{
            user.password = hash;
            next();
          });
        });
    } else {
      // if its not modified we simply dont want to do anything and move forward
      next();
    }
});



module.exports = mongoose.model("User", UserSchema);
