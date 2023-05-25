const {mongoose} = require("./db.config");
const {STATUS} = require("./constants");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: [STATUS.normal, STATUS.disabled, STATUS.enabled]
  },
  createdDate: Date,
  updatedDate: Date,
});
const User = mongoose.model('User', userSchema);

module.exports = {
  userSchema,
  User
}
