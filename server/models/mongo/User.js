const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    // required: [ // TODO: check controller's methods for this
    //   true,
    //   "Please provide password",
    // ],
    minlength: 6,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: String,
  passwordTokenExpirationDate: Date,
});

// Virtual field for consistent user ID format
UserSchema.virtual("userId").get(function () {
  return this._id.toString();
});

// Add toJSON transform to include virtuals and remove sensitive fields
UserSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method for comparing passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // For social login users
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method for social login handling
UserSchema.statics.findOrCreate = async function ({
  email,
  provider,
  providerId,
  name,
}) {
  // Check existing users by email or provider ID
  let user = await this.findOne({
    $or: [{ email }, { [provider]: providerId }],
  });

  if (!user) {
    user = await this.create({
      name,
      email,
      [provider]: providerId,
      role: await this.determineRole(),
      isVerified: true,
    });
  } else {
    // Update provider ID if missing
    if (!user[provider]) {
      user[provider] = providerId;
      await user.save();
    }
  }

  return user;
};

// Static method to determine user role
UserSchema.statics.determineRole = async function () {
  const count = await this.countDocuments();
  return count === 0 ? "admin" : "user";
};

module.exports = mongoose.model("User", UserSchema);
