const {mongoose} = require("./db.config");
const {STATUS,  EMAIL_STATUS} = require("./constants");

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

const mailSchema = new mongoose.Schema({
  client_email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [EMAIL_STATUS.waiting, EMAIL_STATUS.sending, EMAIL_STATUS.sent, EMAIL_STATUS.error]
  },
  response: {
    type: String
  },
  createdDate: Date,
  updatedDate: Date,
})
const Mail = mongoose.model('Mail', mailSchema)

module.exports = {
  userSchema,
  User,
  mailSchema,
  Mail
}
