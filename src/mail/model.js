const {mongoose} = require("../db/db.config");
const {EMAIL_STATUS, EMAIL_TYPE} = require("../shared/constants");
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
  type: {
    type: String,
    enum: [EMAIL_TYPE.create_vpn, EMAIL_TYPE.disable_after_week, EMAIL_TYPE.disable_after_day]
  },
  response: {
    type: String
  },
  createdDate: Date,
  updatedDate: Date,
})
const Model = mongoose.model('Mail', mailSchema)

module.exports = {
  mailSchema,
  Mail: Model
}
