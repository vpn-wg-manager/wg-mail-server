const {mongoose} = require("../db/db.config");
const {STATUS,  EMAIL_STATUS} = require("../shared/constants");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
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
  User,
}
