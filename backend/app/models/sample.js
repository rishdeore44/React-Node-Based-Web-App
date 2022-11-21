var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* function cryptPass(password) {
  //var password= "starbuck";
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      return hash;
    });
  });

} */

const Sample = new mongoose.Schema({
  fullname: { type: String, default: '' },
  email: { type: String, default: '' },
  password: { type: String, default: '' }
});


Sample.pre("save", function (next) {
  const user = this
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(saltRounds, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError)
          }
          console.log("New Password is " +hash);
          user.password = hash
          next();
        })
      }
    })
  } else {
    return next();
  }
})

/* Sample.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    //console.log(this.email,this.password)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    //console.log("PWD: "+this.password)
    next()
  } catch (error) {
    next(error)
  }
}) */

Sample.pre('findOneAndUpdate', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    console.log("called before update.");
    //console.log(this._update.email,this._update.password)
    const hashedPassword = await bcrypt.hash(this._update.password, salt)
    this._update.password = hashedPassword
    console.log("PWD: " + this._update.password)
    next()
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model("Sample", Sample)